import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class StatisticsControllers {
  // Fetch all statistics dismissals
  async getAllstatisticsDismissals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statisticsService = databaseService.getStatisticsServices();
      const statistics = await statisticsService.getAllStatisticsDismissals();
      res.status(200).json(statistics);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getStatisticsInitialization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statisticsService = databaseService.getStatisticsServices();
      const statistics = await statisticsService.getStatisticsInitialization();
      res.status(200).json(statistics);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Additional controller methods can be defined here.
}

export default new StatisticsControllers();