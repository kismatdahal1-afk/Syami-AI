/**
 * HttpError carries an HTTP status code for the global error handler.
 * The errorHandler middleware in middleware/errorHandler.middleware.ts
 * already honors `err.status`.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const badRequest = (message: string): HttpError => new HttpError(400, message);

export const notFound = (message: string): HttpError => new HttpError(404, message);

export const dbUnavailable = (): HttpError =>
  new HttpError(503, 'Database unavailable — check the MongoDB connection');
