import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import {ApiError} from '../../errors/ApiError';


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