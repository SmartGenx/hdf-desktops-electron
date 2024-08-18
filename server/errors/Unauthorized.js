const ApiError = require('../errors/ApiError');

class Unauthorized extends ApiError {
  constructor(message, originalError) {
    // 401 is the standard response code for unauthorized access.
    super(401, 'Unauthorized', message, originalError);
  }
}

module.exports = Unauthorized; // Export the class directly
