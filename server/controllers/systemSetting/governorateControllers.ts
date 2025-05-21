import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class GovernorateController {
  async getAllGovernorates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const GovernorateService = databaseService.getGovernorateService();
      const governorates = await GovernorateService.getAllGovernorates();
      res.status(200).json(governorates);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single governorate by its ID
  async getGovernorateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const GovernorateService = databaseService.getGovernorateService();
      const governorate = await GovernorateService.getGovernorateById(id);
      if (!governorate) {
        return next(new NotFoundError(`Governorate with id ${id} not found.`));
      }
      res.status(200).json(governorate);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new governorate
  async createGovernorate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const GovernorateService = databaseService.getGovernorateService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const { name } = req.body;
      const newGovernorate = await GovernorateService.createGovernorate(name);

      res.status(201).json(newGovernorate);
    } catch (error: any) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing governorate
  async updateGovernorate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const GovernorateService = databaseService.getGovernorateService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const id: string = req.params.id;
      const data = req.body;
      const updatedGovernorate = await GovernorateService.updateGovernorate(id, data);

      if (!updatedGovernorate) {
        return next(new NotFoundError(`Governorate with id ${id} not found.`));
      }

      res.status(200).json(updatedGovernorate);
    } catch (error: any) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a governorate by ID
  async deleteGovernorate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const GovernorateService = databaseService.getGovernorateService();
      const id: string = req.params.id;
      const deletedGovernorateName = await GovernorateService.deleteGovernorate(id);

      res.status(200).json({ message: `The governorate '${deletedGovernorateName}' has been successfully deleted` });
    } catch (error: any) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new GovernorateController();