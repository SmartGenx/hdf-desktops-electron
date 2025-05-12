const { databaseService } = require('../../database'); // Adjust the import path as needed
const { validationResult } = require('express-validator');
const ApiError = require('../../errors/ApiError');
const DatabaseError = require('../../errors/DatabaseError');
const ValidationError = require('../../errors/ValidationError');
const NotFoundError = require('../../errors/NotFoundError');

class DismissalController {
  // Fetch all dismissals
  async getAllDismissals(req, res, next) {
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

  async createDismissal(req, res, next) {
    try {
      const DismissalService = databaseService.getDismissalService();
      const DismissalData = req.body
      const dismissals = await DismissalService.createDismissal(DismissalData);


      res.status(201).json(dismissals);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
  async checkDismissal(req, res, next) {
    try {
      const DismissalService = databaseService.getDismissalService();
      const DismissalData = req.body
      const dismissals = await DismissalService.checkDismissal(DismissalData);


      res.status(201).json(dismissals);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single dismissal by its ID
  async getDismissalById(req, res, next) {
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
  async updateDismissal(req, res, next) {
    try {
      const DismissalService = databaseService.getDismissalService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const id = req.params.id;
      const DismissalDatat = req.body;
      const updatedDismissal = await DismissalService.updateDismissal(id, DismissalDatat);

      if (!updatedDismissal) {
        return next(new NotFoundError(`Dismissal with id ${id} not found.`));
      }

      res.status(200).json(updatedDismissal);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Delete a dismissal by ID
  async deleteDismissal(req, res, next) {
    try {
      const DismissalService = databaseService.getDismissalService();
      const id = req.params.id;
      const deletedDismissalMonth = await DismissalService.deleteDismissal(id);

      res.status(200).json({ message: `The dismissal for month '${deletedDismissalMonth}' has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

module.exports = new DismissalController();
