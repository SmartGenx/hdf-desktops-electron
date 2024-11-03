const { databaseService } = require('../database'); // Adjust the import path as needed
const { validationResult } = require('express-validator');
const ApiError = require('../errors/ApiError');
const DatabaseError = require('../errors/DatabaseError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

class PharmacyController {
  // Fetch all pharmacies
  async getAllPharmacies(req, res, next) {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const pharmacies = await PharmacyService.getAllPharmacies();
      res.status(200).json(pharmacies);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single pharmacy by its ID
  async getPharmacyById(req, res, next) {
    try {
      const id = req.params.id;
      const PharmacyService = databaseService.getPharmacyService();
      const pharmacy = await PharmacyService.getPharmacyById(id);
      if (!pharmacy) {
        return next(new NotFoundError(`Pharmacy with id ${id} not found.`));
      }
      res.status(200).json(pharmacy);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
  // Create a new pharmacy
  async createPharmacy(req, res, next) {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const PharmacyData = req.body;
      const newPharmacy = await PharmacyService.createPharmacy(PharmacyData);


      res.status(201).json(newPharmacy);
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      res.status(500).json({ message: `${error}` });

    }
  }

  // Update an existing pharmacy
  async updatePharmacy(req, res, next) {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id = req.params.id;
      const data = req.body;
      const updatedPharmacy = await PharmacyService.updatePharmacy(id, data);
      if (!updatedPharmacy) {
        return next(new NotFoundError(`Pharmacy with id ${id} not found.`));
      }
      res.status(200).json(updatedPharmacy);
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      res.status(500).json({ message: `${error}` });

    }
  }

  // Delete a pharmacy by ID
  async deletePharmacy(req, res, next) {
    try {
      const PharmacyService = databaseService.getPharmacyService();
      const id = req.params.id;
      const deletedPharmacyName = await PharmacyService.deletePharmacy(id);

      res.status(200).json({ message: `The pharmacy '${deletedPharmacyName}' has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

module.exports = new PharmacyController();
