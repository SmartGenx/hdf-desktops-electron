import { Request, Response, NextFunction } from 'express';
import { synchronizeAll } from '../../syncProcess';
import { databaseService } from '../../database';
import {ApiError} from '../../errors/ApiError';


class SyncProcessControllers {
  // Synchronize all processes
  async synchronizeAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await synchronizeAll();
      res.status(200).json({ message: 'Synchronization completed successfully' });
    } catch (error) {
      console.error('Synchronization error:', error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Check pending sync data
  async checkPendingSyncData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hasPending = await databaseService.hasPendingSyncData();
      res.status(200).json({ hasPendingData: hasPending });
    } catch (error) {
      console.error('خطأ في التحقق من البيانات المعلقة:', error);
      next(new ApiError(500, 'InternalServer', 'خطأ في الخادم الداخلي'));
    }
  }
}

export default new SyncProcessControllers();