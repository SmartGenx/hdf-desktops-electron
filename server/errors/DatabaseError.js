const ApiError = require('../errors/ApiError');

class DatabaseError extends ApiError {
  // Additional properties if needed for more context

  constructor(message, originalError) {
    super(500, 'DatabaseError', message, originalError);
    // You can log the `originalError` here or in centralized error handling middleware
  }

  // If needed, override `toResponseJSON` to customize the response for database errors
}

module.exports = DatabaseError;
