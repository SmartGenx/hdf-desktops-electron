import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class ApplicantController {
  // Fetch applicants by category
  async ApplicantReportCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const applicantfilter = req.query;
      const applicantsData = await ApplicantService.ApplicantByCategory(applicantfilter);
      res.status(200).json(applicantsData);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Don't delete
  async getAllOrSearchApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const searchTerm = req.query; // Assuming the search term comes as a query parameter
      const applicants = await ApplicantService.getAllApplicants(searchTerm);
      res.status(200).json(applicants);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getAllApplicantsUseUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const searchTerm = req.query; // Assuming the search term comes as a query parameter
      const applicants = await ApplicantService.getAllApplicantsUseUpdate(searchTerm);
      res.status(200).json(applicants);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single applicant by its ID
  async getApplicantById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const ApplicantService = databaseService.getApplicantService();
      const applicant = await ApplicantService.getApplicantById(id);
      if (!applicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`));
      }
      res.status(200).json(applicant);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new applicant
  async createApplicant(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ApplicantService = databaseService.getApplicantService();
    try {
      const ApplicantData = req.body;
      // Check if all required fields are present in the request body
      if (!ApplicantData) {
        throw new ValidationError('Missing required fields.');
      }
      const newApplicant = await ApplicantService.createApplicant(ApplicantData);
      res.status(201).json(newApplicant);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Update an existing applicant
  async updateApplicant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id = req.params.id;
      const ApplicantData = req.body;
      const updatedApplicant = await ApplicantService.updateApplicant(id, ApplicantData);
      if (!updatedApplicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`));
      }
      res.status(200).json(updatedApplicant);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async updateApplicantAccredited(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id = req.params.id;
      const updatedApplicant = await ApplicantService.updateApplicantAccredited(id);
      if (!updatedApplicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`));
      }
      res.status(200).json(updatedApplicant);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Delete an applicant by ID
  async deleteApplicant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const id = req.params.id;
      const deletedApplicantName = await ApplicantService.deleteApplicant(id);
      res.status(200).json({
        message: `The applicant '${deletedApplicantName}' has been successfully deleted`
      });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async countAllApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const count = await ApplicantService.countAllApplicants();
      res.json({ count });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Get monthly gender counts by applicant (if needed)
  async getApplicantMonthlyGenderCounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const applicantMonthlyGenderCountsWithSquareCount = await ApplicantService.getApplicantMonthlyGenderCounts();
      res.json({ applicantMonthlyGenderCountsWithSquareCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get all accredited applicants after dismissal
  async getAllAccreditedAfterDismissal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ApplicantService = databaseService.getApplicantService();
      const filterParams = req.query;
      const applicants = await ApplicantService.getAllAccreditedAfterDismissal(filterParams);
      res.status(200).json(applicants);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new ApplicantController();