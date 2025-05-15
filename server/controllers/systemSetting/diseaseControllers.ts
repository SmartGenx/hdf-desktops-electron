import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class DiseaseController {
  // Fetch all diseases
  async getAllDiseases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DiseaseService = databaseService.getDiseaseService();
      const diseases = await DiseaseService.getAllDiseases();
      res.status(200).json(diseases);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single disease by its ID
  async getDiseaseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const DiseaseService = databaseService.getDiseaseService();
      const disease = await DiseaseService.getDiseaseById(id);
      if (!disease) {
        return next(new NotFoundError(`Disease with id ${id} not found.`));
      }
      res.status(200).json(disease);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new disease
  async createDisease(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DiseaseService = databaseService.getDiseaseService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const { name, description } = req.body;
      const newDisease = await DiseaseService.createDisease(name, description);
      res.status(201).json(newDisease);
    } catch (error) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing disease
  async updateDisease(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DiseaseService = databaseService.getDiseaseService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id = req.params.id;
      const data = req.body;
      const updatedDisease = await DiseaseService.updateDisease(id, data);
      if (!updatedDisease) {
        return next(new NotFoundError(`Disease with id ${id} not found.`));
      }
      res.status(200).json(updatedDisease);
    } catch (error) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a disease by ID
  async deleteDisease(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DiseaseService = databaseService.getDiseaseService();
      const id = req.params.id;
      const deletedDiseaseName = await DiseaseService.deleteDisease(id);
      res.status(200).json({ message: `The disease '${deletedDiseaseName}' has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new DiseaseController();