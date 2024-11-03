// Since interfaces don't exist in JavaScript, we won't directly convert IErrorResponse.
// However, the structure can still be used as a reference for the expected shape of error responses.

class ApiError extends Error {
  constructor(statusCode, errorType, message, originalError) {
    super(message);;
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toResponseJSON() {
    return {
      status: "error",
      statusCode: this.statusCode,
      message: this.message,
      // When implementing this in JavaScript, ensure no sensitive details are included, especially from `originalError`.
    };
  }
}
module.exports = ApiError;
