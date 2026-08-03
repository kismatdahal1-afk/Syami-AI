/**
 * HttpError carries an HTTP status code for the global error handler.
 * The errorHandler middleware in middleware/errorHandler.middleware.ts
 * already honors `err.status`.
 *
 * `expose` marks messages that are safe to send to clients even for
 * 5xx statuses (e.g. user-friendly AI service messages). Unknown 5xx
 * messages stay masked to avoid leaking internals.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly expose: boolean;

  constructor(status: number, message: string, expose = false) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.expose = expose;
  }
}

export const badRequest = (message: string): HttpError => new HttpError(400, message);

export const notFound = (message: string): HttpError => new HttpError(404, message);

export const dbUnavailable = (): HttpError =>
  new HttpError(503, 'Database unavailable — check the MongoDB connection');

/** User-friendly AI failure (Ollama down, model missing, request failed). */
export const aiUnavailable = (message: string): HttpError => new HttpError(503, message, true);

/** AI request timed out. */
export const aiTimeout = (message: string): HttpError => new HttpError(504, message, true);
