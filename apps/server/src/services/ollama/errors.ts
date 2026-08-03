/**
 * Typed Ollama failures (Phase 5).
 *
 * The Ollama service throws these so upper layers can translate them into
 * user-friendly HTTP errors (503 / 504) without knowing HTTP details.
 */
export class OllamaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OllamaError';
  }
}

export class OllamaConnectionError extends OllamaError {
  constructor() {
    super('Ollama is not running — start it with `ollama serve` and try again');
    this.name = 'OllamaConnectionError';
  }
}

export class OllamaModelError extends OllamaError {
  constructor(model: string, detail?: string) {
    const message =
      detail !== undefined && detail.length > 0
        ? detail.includes('not found')
          ? `AI model "${model}" is not installed — run \`ollama pull ${model}\``
          : `Ollama error: ${detail}`
        : `AI model "${model}" is unavailable`;
    super(message);
    this.name = 'OllamaModelError';
  }
}

export class OllamaTimeoutError extends OllamaError {
  constructor(model?: string) {
    super(`AI request timed out${model ? ` (model: ${model})` : ''} — please try again`);
    this.name = 'OllamaTimeoutError';
  }
}

export class OllamaEmptyResponseError extends OllamaError {
  constructor(model: string) {
    super(`AI returned an empty response for "${model}" — please try again`);
    this.name = 'OllamaEmptyResponseError';
  }
}

export class OllamaRequestError extends OllamaError {
  constructor(detail: string) {
    super(`AI request failed: ${detail}`);
    this.name = 'OllamaRequestError';
  }
}
