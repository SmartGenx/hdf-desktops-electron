const ApiError = require('../errors/ApiError');

class NotFoundError extends ApiError {
  constructor(message, originalError) {
    // 404 is the standard response code for not found resources.
    super(404, 'NotFoundError', message, originalError);
  }
}

module.exports = NotFoundError;
