const { databaseService } = require('../database'); // Adjust the import path as needed
const { validationResult } = require("express-validator");
const ApiError = require("../errors/ApiError");
const DatabaseError = require("../errors/DatabaseError");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");

class DirectorateController {
  // Fetch all directorates
  async getAllDirectorates(req, res, next) {
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
  async getDirectorateById(req, res, next) {
    try {
      const id = req.params.id;
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
  async createDirectorate(req, res, next) {
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
      // next(new ApiError(500, "InternalServer", "Internal Server Error"));
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing directorate
  async updateDirectorate(req, res, next) {
    try {
      const DirectorateService = databaseService.getDirectorateService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError("Validation Failed", errors.array()));
      }
      const id = req.params.id;
      const data = req.body;
      const updatedDirectorate = await DirectorateService.updateDirectorate(
        id,
        data
      );
      if (!updatedDirectorate) {
        return next(new NotFoundError(`Directorate with id ${id} not found.`));
      }
      res.status(200).json(updatedDirectorate);
    } catch (error) {
      // next(new ApiError(500, "InternalServer", "Internal Server Error"));
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a directorate by ID
  async deleteDirectorate(req, res, next) {
    try {
      const DirectorateService = databaseService.getDirectorateService();
      const id = req.params.id;
      const deletedDirectorateName = await DirectorateService.deleteDirectorate(
        id
      );
      res.status(200).json({
        message: `The directorate '${deletedDirectorateName}' has been successfully deleted`,
      });
    } catch (error) {
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }
}

module.exports = new DirectorateController();
