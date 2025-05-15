import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import ApiError from '../../errors/ApiError';
import DatabaseError from '../../errors/DatabaseError';
import ValidationError from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class DirectorateController {
  // Fetch all directorates
  async getAllDirectorates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DirectorateService = databaseService.getDirectorateService();
      const directorates = await DirectorateService.getAllDirectorates();
      res.status(200).json(directorates);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }

  // Fetch a single directorate by its ID
  async getDirectorateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const DirectorateService = databaseService.getDirectorateService();
      const directorate = await DirectorateService.getDirectorateById(id);
      if (!directorate) {
        return next(new NotFoundError(`Directorate with id ${id} not found.`));
      }
      res.status(200).json(directorate);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }

  // Create a new directorate
  async createDirectorate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DirectorateService = databaseService.getDirectorateService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError("Validation Failed", errors.array()));
      }
      const data = req.body;
      const newDirectorate = await DirectorateService.createDirectorate(data);
      res.status(201).json(newDirectorate);
    } catch (error) {
      // You can choose to use next() for error handling or respond directly
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing directorate
  async updateDirectorate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DirectorateService = databaseService.getDirectorateService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError("Validation Failed", errors.array()));
      }
      const id: string = req.params.id;
      const data = req.body;
      const updatedDirectorate = await DirectorateService.updateDirectorate(id, data);
      if (!updatedDirectorate) {
        return next(new NotFoundError(`Directorate with id ${id} not found.`));
      }
      res.status(200).json(updatedDirectorate);
    } catch (error) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a directorate by ID
  async deleteDirectorate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const DirectorateService = databaseService.getDirectorateService();
      const id: string = req.params.id;
      const deletedDirectorateName = await DirectorateService.deleteDirectorate(id);
      res.status(200).json({
        message: `The directorate '${deletedDirectorateName}' has been successfully deleted`,
      });
    } catch (error) {
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }
}

export default new DirectorateController();