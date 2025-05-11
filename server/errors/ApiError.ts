export interface IErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
}

export class ApiError extends Error {
  public statusCode: number;
  public errorType: string;
  public originalError?: unknown;

  constructor(
    statusCode: number,
    errorType: string,
    message: string,
    originalError?: unknown
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errorType = errorType;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toResponseJSON(): IErrorResponse {
    return {
      status: 'error',
      statusCode: this.statusCode,
      message: this.message
    };
  }
}
