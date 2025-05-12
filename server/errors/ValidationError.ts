import { ApiError, IErrorResponse } from './ApiError';

export class ValidationError extends ApiError {
  public errors?: unknown;

  constructor(message: string, errors?: unknown, originalError?: unknown) {
    super(400, 'ValidationError', message, originalError);
    if (errors) {
      this.errors = errors;
    }
  }

  override toResponseJSON(): IErrorResponse & { errors?: unknown } {
    const response = super.toResponseJSON();
    if (this.errors) {
      return { ...response, errors: this.errors };
    }
    return response;
  }
}
