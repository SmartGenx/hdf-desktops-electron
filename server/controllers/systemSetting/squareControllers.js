const { databaseService } = require('../../database');
const { validationResult } = require('express-validator');
const ApiError = require('../../errors/ApiError');
const DatabaseError = require('../../errors/DatabaseError');
const ValidationError = require('../../errors/ValidationError');
const NotFoundError = require('../../errors/NotFoundError');

class SquareController {
  // Fetch all squares
  async getAllSquares(req, res, next) {
    try {
      const SquareService = databaseService.getSquareService();
      const squares = await SquareService.getAllSquares();
      res.status(200).json(squares);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single square by its ID
  async getSquareById(req, res, next) {
    try {
      const id = req.params.id;
      const SquareService = databaseService.getSquareService();
      const square = await SquareService.getSquareById(id);
      if (!square) {
        return next(new NotFoundError(`Square with id ${id} not found.`));
      }
      res.status(200).json(square);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new square
  async createSquare(req, res, next) {
    try {
      const SquareService = databaseService.getSquareService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const { name } = req.body;
      const newSquare = await SquareService.createSquare(name);
      res.status(201).json(newSquare);
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      res.status(500).json({ message: `${error}` });

    }
  }

  // Update an existing square
  async updateSquare(req, res, next) {
    try {
      const SquareService = databaseService.getSquareService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id = req.params.id;
      const data = req.body;
      const updatedSquare = await SquareService.updateSquare(id, data);
      if (!updatedSquare) {
        return next(new NotFoundError(`Square with id ${id} not found.`));
      }

      res.status(200).json(updatedSquare);
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      res.status(500).json({ message: `${error}` });

    }
  }

  // Delete a square by ID
  async deleteSquare(req, res, next) {
    try {
      const SquareService = databaseService.getSquareService();
      const id = req.params.id;
      const deletedSquareName = await SquareService.deleteSquare(id);

      res.status(200).json({ message: `The square '${deletedSquareName}' has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

module.exports = new SquareController();
