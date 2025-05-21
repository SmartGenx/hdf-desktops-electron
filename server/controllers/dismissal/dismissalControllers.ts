import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class DismissalController {
  // Fetch all dismissals
  async getAllDismissals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DismissalService = databaseService.getDismissalService();
      const filterdata = req.query;
      const dismissals = await DismissalService.getAllDismissals(filterdata);
      res.status(200).json(dismissals);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async createDismissal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DismissalService = databaseService.getDismissalService();
      const DismissalData = req.body;
      const dismissals = await DismissalService.createDismissal(DismissalData);
      res.status(201).json(dismissals);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async checkDismissal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DismissalService = databaseService.getDismissalService();
      const DismissalData = req.body;
      const dismissals = await DismissalService.checkDismissal(DismissalData);
      res.status(201).json(dismissals);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single dismissal by its ID
  async getDismissalById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const DismissalService = databaseService.getDismissalService();
      const dismissal = await DismissalService.getDismissalById(id);
      if (!dismissal) {
        return next(new NotFoundError(`Dismissal with id ${id} not found.`));
      }
      res.status(200).json(dismissal);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Update an existing dismissal
  async updateDismissal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DismissalService = databaseService.getDismissalService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id = req.params.id;
      const DismissalData = req.body;
      const updatedDismissal = await DismissalService.updateDismissal(id, DismissalData);
      if (!updatedDismissal) {
        return next(new NotFoundError(`Dismissal with id ${id} not found.`));
      }
      res.status(200).json(updatedDismissal);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Delete a dismissal by ID
  async deleteDismissal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DismissalService = databaseService.getDismissalService();
      const id = req.params.id;
      const deletedDismissalMonth = await DismissalService.deleteDismissal(id);
      res.status(200).json({
        message: `The dismissal for month '${deletedDismissalMonth}' has been successfully deleted`
      });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new DismissalController();