const { databaseService } = require('../../database');
const { validationResult } = require('express-validator');
const ApiError = require('../../errors/ApiError');
const DatabaseError = require('../../errors/DatabaseError');
const ValidationError = require('../../errors/ValidationError');
const NotFoundError = require('../../errors/NotFoundError');

class statisticsControllers {
  // Fetch all squares
  async getAllstatisticsDismissals(req, res, next) {
    try {
      const  statisticsService = databaseService.getStatisticsServices();
      const statistics = await statisticsService.getAllStatisticsDismissals();
      res.status(200).json(statistics);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }

  }
  async getStatisticsInitialization(req, res, next) {
    try {
      const  statisticsService = databaseService.getStatisticsServices();
      const statistics = await statisticsService.getStatisticsInitialization();
      res.status(200).json(statistics);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }

  }

  // Fetch a single square by its ID

}

module.exports = new statisticsControllers();
