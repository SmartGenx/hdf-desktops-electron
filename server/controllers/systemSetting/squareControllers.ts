import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class SquareController {
  // Fetch all squares
  async getAllSquares(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const SquareService = databaseService.getSquareService();
      const squares = await SquareService.getAllSquares();
      res.status(200).json(squares);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single square by its ID
  async getSquareById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const SquareService = databaseService.getSquareService();
      const square = await SquareService.getSquareById(id);
      if (!square) {
        return next(new NotFoundError(`Square with id ${id} not found.`));
      }
      res.status(200).json(square);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new square
  async createSquare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const SquareService = databaseService.getSquareService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const { name } = req.body;
      const newSquare = await SquareService.createSquare(name);
      res.status(201).json(newSquare);
    } catch (error: any) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing square
  async updateSquare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const SquareService = databaseService.getSquareService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id: string = req.params.id;
      const data = req.body;
      const updatedSquare = await SquareService.updateSquare(id, data);
      if (!updatedSquare) {
        return next(new NotFoundError(`Square with id ${id} not found.`));
      }
      res.status(200).json(updatedSquare);
    } catch (error: any) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a square by ID
  async deleteSquare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const SquareService = databaseService.getSquareService();
      const id: string = req.params.id;
      const deletedSquareName = await SquareService.deleteSquare(id);
      res.status(200).json({ message: `The square '${deletedSquareName}' has been successfully deleted` });
    } catch (error: any) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new SquareController();