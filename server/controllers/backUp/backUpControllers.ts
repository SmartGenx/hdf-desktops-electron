import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import {ApiError} from '../../errors/ApiError';


class BackUpControllers {
  // Fetch all categories
  async getbackup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backupServices = databaseService.getBackupServices();
      const dataFillter = req.query;
      const categories = await backupServices.getBackup(dataFillter);
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getcreate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const backupServices = databaseService.getBackupServices();
      const { path, userName } = req.body;
      const categories = await backupServices.createBackup(path, userName);
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new BackUpControllers();