const { databaseService } = require('../../database');
const { validationResult } = require('express-validator');
const ApiError = require('../../errors/ApiError');
const DatabaseError = require('../../errors/DatabaseError');
const ValidationError = require('../../errors/ValidationError');
const NotFoundError = require('../../errors/NotFoundError');

class GovernorateController {


  async getAllGovernorates(req, res, next) {
    try {
      const GovernorateService = databaseService.getGovernorateService();
      const governorates = await GovernorateService.getAllGovernorates();
      res.status(200).json(governorates);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single governorate by its ID
  async getGovernorateById(req, res, next) {
    try {
      const id = req.params.id;
      const GovernorateService = databaseService.getGovernorateService();
      const governorate = await GovernorateService.getGovernorateById(id);
      if (!governorate) {
        return next(new NotFoundError(`Governorate with id ${id} not found.`));
      }
      res.status(200).json(governorate);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new governorate
  async createGovernorate(req, res, next) {

    try {
      const GovernorateService = databaseService.getGovernorateService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const { name } = req.body;
      const newGovernorate = await GovernorateService.createGovernorate(name);

      res.status(201).json(newGovernorate);
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing governorate
  async updateGovernorate(req, res, next) {
    try {
      const GovernorateService = databaseService.getGovernorateService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const id = req.params.id;
      const data = req.body;
      const updatedGovernorate = await GovernorateService.updateGovernorate(id, data);

      if (!updatedGovernorate) {
        return next(new NotFoundError(`Governorate with id ${id} not found.`));
      }

      res.status(200).json(updatedGovernorate);
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a governorate by ID
  async deleteGovernorate(req, res, next) {
    try {
      const GovernorateService = databaseService.getGovernorateService();
      const id = req.params.id;
      const deletedGovernorateName = await GovernorateService.deleteGovernorate(id);

      res.status(200).json({ message: `The governorate '${deletedGovernorateName}' has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

module.exports = new GovernorateController();
