const { databaseService } = require('../database'); // Adjust the import path as needed
const { validationResult } = require('express-validator');
const ApiError = require('../errors/ApiError');
const DatabaseError = require('../errors/DatabaseError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

class backUpControllers {
  // Fetch all categories
  async getbackup(req, res, next) {
    try {
      const backupServices = databaseService.getbackupServices();
      const dataFillter = req.query
      const categories = await backupServices.getbackup(dataFillter);
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
  async getcreate(req, res, next) {
    try {
      const backupServices = databaseService.getbackupServices();
      const dataFillter = req.body
      const categories = await backupServices.createbackup(dataFillter);
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single category by its ID

}

module.exports = new backUpControllers();
