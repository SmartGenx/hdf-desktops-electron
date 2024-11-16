const { synchronizeAll } = require('../syncProcess');
const { validationResult } = require('express-validator');
const ApiError = require('../errors/ApiError');
const DatabaseError = require('../errors/DatabaseError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

class syncProcessControllers {
  // Fetch all squares
  async synchronizeAll(req, res, next) {
    try {
      // انتظار اكتمال المزامنة
      await synchronizeAll();

      res.status(200).json({ message: 'Synchronization completed successfully' });
    } catch (error) {
      console.error('Synchronization error:', error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

}

module.exports = new syncProcessControllers();
