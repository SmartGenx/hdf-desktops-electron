import { ApiError } from './ApiError';

export class DatabaseError extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(500, 'DatabaseError', message, originalError);
  }

}

export default DatabaseError;