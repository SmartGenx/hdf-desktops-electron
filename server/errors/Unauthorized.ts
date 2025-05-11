import { ApiError } from './ApiError';

export class Unauthorized extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(401, 'Unauthorized', message, originalError);
  }
}
