import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class PharmacyController {
  // Fetch all pharmacies
  async getAllPharmacies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const pharmacies = await PharmacyService.getAllPharmacies();
      res.status(200).json(pharmacies);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single pharmacy by its ID
  async getPharmacyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const PharmacyService = databaseService.getPharmacyService();
      const pharmacy = await PharmacyService.getPharmacyById(id);
      if (!pharmacy) {
        return next(new NotFoundError(`Pharmacy with id ${id} not found.`));
      }
      res.status(200).json(pharmacy);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new pharmacy
  async createPharmacy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const PharmacyData = req.body;
      const newPharmacy = await PharmacyService.createPharmacy(PharmacyData);
      res.status(201).json(newPharmacy);
    } catch (error: any) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing pharmacy
  async updatePharmacy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id: string = req.params.id;
      const data = req.body;
      const updatedPharmacy = await PharmacyService.updatePharmacy(id, data);
      if (!updatedPharmacy) {
        return next(new NotFoundError(`Pharmacy with id ${id} not found.`));
      }
      res.status(200).json(updatedPharmacy);
    } catch (error: any) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a pharmacy by ID
  async deletePharmacy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const id: string = req.params.id;
      const deletedPharmacyName = await PharmacyService.deletePharmacy(id);
      res.status(200).json({ message: `The pharmacy '${deletedPharmacyName}' has been successfully deleted` });
    } catch (error: any) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new PharmacyController();