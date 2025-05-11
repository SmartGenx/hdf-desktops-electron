import { ApiError } from './ApiError';

export class NotFoundError extends ApiError {
  constructor(message: string, originalError?: unknown) {
    super(404, 'NotFoundError', message, originalError);
  }
}
 export default NotFoundError