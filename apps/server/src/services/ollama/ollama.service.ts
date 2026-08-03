export interface OllamaModel {
  name: string;
  size: number;
}

export interface OllamaGenerateParams {
  model: string;
  messages: unknown[];
  temperature?: number;
}

export interface OllamaStatus {
  running: boolean;
  version?: string;
}

/**
 * Ollama integration service.
 *
 * Phase 1: placeholder only - no requests are sent to Ollama.
 * Actual implementation is planned for Phase 7 (AI Integration).
 */
export class OllamaService {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultModel: string,
  ) {}

  async getStatus(): Promise<OllamaStatus> {
    throw new Error(`Ollama not implemented yet (planned for Phase 7) at: ${this.baseUrl}`);
  }

  async getModels(): Promise<OllamaModel[]> {
    throw new Error(`Ollama not implemented yet (planned for Phase 7) at: ${this.baseUrl}`);
  }

  async generate(params: OllamaGenerateParams): Promise<string> {
    const model = params.model ?? this.defaultModel;
    throw new Error(`Ollama not implemented yet (planned for Phase 7) for model: ${model}`);
  }
}
