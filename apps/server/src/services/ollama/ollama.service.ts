import axios, { type AxiosInstance, isAxiosError } from 'axios';
import {
  OllamaConnectionError,
  OllamaEmptyResponseError,
  OllamaError,
  OllamaModelError,
  OllamaRequestError,
  OllamaTimeoutError,
} from './errors.js';

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaModel {
  name: string;
  size: number;
}

export interface OllamaStatus {
  running: boolean;
  version?: string;
}

export interface OllamaGenerateParams {
  model: string;
  messages: OllamaChatMessage[];
  temperature?: number;
  numPredict?: number;
  numCtx?: number;
  topP?: number;
  repeatPenalty?: number;
}

interface OllamaChatResponse {
  message?: { content?: string };
  error?: string;
}

/**
 * Ollama integration service (Phase 5).
 *
 * Thin HTTP client for the local Ollama server. Responsibilities:
 * - connect to Ollama (GET /api/version, GET /api/tags)
 * - send prompts and receive responses (POST /api/chat)
 * - handle errors and timeouts via typed Ollama* errors
 * - stream support prepared for Phase 8 (streamGenerate)
 *
 * A single axios instance is created at module load and reused for every
 * request, so connections are pooled instead of recreated.
 */
export class OllamaService {
  private readonly client: AxiosInstance;

  constructor(
    baseUrl: string,
    private readonly defaultModel: string,
    timeoutMs: number,
  ) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getStatus(): Promise<OllamaStatus> {
    try {
      const response = await this.client.get<{ version: string }>('/api/version');
      return { running: true, version: response.data.version };
    } catch {
      return { running: false };
    }
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.client.get<{ models: { name: string; size: number }[] }>('/api/tags');
      return response.data.models.map((model) => ({ name: model.name, size: model.size }));
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async generate(params: OllamaGenerateParams): Promise<string> {
    const model = params.model ?? this.defaultModel;
    try {
      const response = await this.client.post<OllamaChatResponse>('/api/chat', {
        model,
        messages: params.messages,
        stream: false,
        options: this.buildOptions(params),
      });
      const content = response.data.message?.content?.trim();
      if (!content) throw new OllamaEmptyResponseError(model);
      return content;
    } catch (error) {
      if (error instanceof OllamaError) throw error;
      throw this.translateError(error, model);
    }
  }

  /**
   * Streaming seam (Phase 8): yields content chunks from Ollama's NDJSON
   * response. Not consumed by any route yet - the chat pipeline stays
   * non-streaming while streaming is prepared here.
   */
  async *streamGenerate(params: OllamaGenerateParams): AsyncGenerator<string> {
    const model = params.model ?? this.defaultModel;
    let stream: unknown;
    try {
      const response = await this.client.post('/api/chat', {
        model,
        messages: params.messages,
        stream: true,
        options: this.buildOptions(params),
      }, { responseType: 'stream' });
      stream = response.data;
    } catch (error) {
      throw this.translateError(error, model);
    }

    let buffer = '';
    for await (const chunk of stream as AsyncIterable<Buffer>) {
      buffer += chunk.toString('utf8');
      let newline: number;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        const parsed = JSON.parse(line) as OllamaChatResponse & { done?: boolean };
        if (parsed.error) throw new OllamaModelError(model, parsed.error);
        if (parsed.message?.content) yield parsed.message.content;
      }
    }
  }

  private buildOptions(params: OllamaGenerateParams): Record<string, number> {
    const options: Record<string, number> = {};
    if (params.temperature !== undefined) options.temperature = params.temperature;
    if (params.numPredict !== undefined) options.num_predict = params.numPredict;
    if (params.numCtx !== undefined) options.num_ctx = params.numCtx;
    if (params.topP !== undefined) options.top_p = params.topP;
    if (params.repeatPenalty !== undefined) options.repeat_penalty = params.repeatPenalty;
    return options;
  }

  private translateError(error: unknown, model?: string): unknown {
    if (error instanceof OllamaError) return error;
    if (isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'EHOSTUNREACH') {
        return new OllamaConnectionError();
      }
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return new OllamaTimeoutError(model ?? this.defaultModel);
      }
      if (error.response?.status === 404) {
        return new OllamaModelError(model ?? this.defaultModel, this.extractErrorDetail(error));
      }
      return new OllamaRequestError(this.extractErrorDetail(error) ?? error.message);
    }
    return new OllamaRequestError(error instanceof Error ? error.message : 'unknown error');
  }

  private extractErrorDetail(error: unknown): string | undefined {
    if (!isAxiosError(error)) return undefined;
    const detail = error.response?.data;
    if (detail !== null && typeof detail === 'object' && 'error' in detail && typeof (detail as { error: unknown }).error === 'string') {
      return (detail as { error: string }).error;
    }
    return undefined;
  }
}
