import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class BackUpControllers {
  // Fetch all categories
  async getbackup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backupServices = databaseService.getbackupServices();
      const dataFillter = req.query;
      const categories = await backupServices.getbackup(dataFillter);
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getcreate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backupServices = databaseService.getbackupServices();
      const dataFillter = req.body;
      const categories = await backupServices.createbackup(dataFillter);
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new BackUpControllers();