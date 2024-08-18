const { databaseService } = require('../database'); // Adjust the import path as needed
const { validationResult } = require("express-validator");
const ApiError = require("../errors/ApiError");
const DatabaseError = require("../errors/DatabaseError");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");

class DiseasesApplicantsController {
  async getAllDiseasesApplicants(req, res, next) {
    try {
      const DiseasesApplicantsService =
        databaseService.getDiseasesApplicantsService();
      const diseasesApplicants =
        await DiseasesApplicantsService.getAllDiseasesApplicants();
      res.status(200).json(diseasesApplicants);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }

  async getDiseasesApplicantsById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const DiseasesApplicantsService =
        databaseService.getDiseasesApplicantsService();
      const diseasesApplicants =
        await DiseasesApplicantsService.getDiseasesApplicantsById(id);
      if (!diseasesApplicants) {
        return next(
          new NotFoundError(`Diseases Applicants with id ${id} not found.`)
        );
      }
      res.status(200).json(diseasesApplicants);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }

  async createDiseasesApplicants(req, res, next) {
    try {
      const DiseasesApplicantsService =
        databaseService.getDiseasesApplicantsService();
      const { diseaseId, applicantId } = req.body;
      const newDiseasesApplicants =
        await DiseasesApplicantsService.createDiseasesApplicants(
          diseaseId,
          applicantId
        );

      res.status(201).json(newDiseasesApplicants);
    } catch (error) {
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }

  async updateDiseasesApplicants(req, res, next) {
    try {
      const DiseasesApplicantsService =
        databaseService.getDiseasesApplicantsService();
      const id = req.params.id;
      const {diseaseGlobalId ,applicantGlobalId} = req.body;
      const updatedDiseasesApplicants =
        await DiseasesApplicantsService.updateDiseasesApplicants(
          id,
          diseaseGlobalId,
          applicantGlobalId
        );

      if (!updatedDiseasesApplicants) {
        return next(
          new NotFoundError(`Diseases Applicants with id ${id} not found.`)
        );
      }

      res.status(200).json(updatedDiseasesApplicants);
    } catch (error) {
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }

  async deleteDiseasesApplicants(req, res, next) {
    try {
      const DiseasesApplicantsService =
        databaseService.getDiseasesApplicantsService();
      const id = Number(req.params.id);
      await DiseasesApplicantsService.deleteDiseasesApplicants(id);

      res
        .status(200)
        .json({
          message: `Diseases Applicants with ID ${id} has been successfully deleted`,
        });
    } catch (error) {
      next(new ApiError(500, "InternalServer", "Internal Server Error"));
    }
  }
}

module.exports = new DiseasesApplicantsController();
