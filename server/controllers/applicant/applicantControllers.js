const { databaseService } = require('../../database') // Adjust the import path as needed
const { validationResult } = require('express-validator')
const ApiError = require('../../errors/ApiError')
const DatabaseError = require('../../errors/DatabaseError')
const ValidationError = require('../../errors/ValidationError')
const NotFoundError = require('../../errors/NotFoundError')
const fs = require('fs')
const path = require('path')
// const officegen = require('officegen');
class ApplicantController {
  // Fetch all applicants
  //--
  async ApplicantReportCategory(req, res, next) {
    // try {
      const ApplicantService = databaseService.getApplicantService()
      const applicantfilter = req.query
      const applicantsData = await ApplicantService.ApplicantByCategory(applicantfilter)
      res.status(200).json(applicantsData)
    // } catch (error) {
    //   next(new ApiError(error.message, error.status))
    // }
  }



  //--


  //dont delete
  async getAllOrSearchApplicants(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const searchTerm = req.query // Assuming the search term comes as a query parameter
      const applicants = await ApplicantService.getAllApplicants(searchTerm)
      res.status(200).json(applicants)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Fetch a single applicant by its ID
  //--
  async getApplicantById(req, res, next) {
    try {
      const id = req.params.id
      const ApplicantService = databaseService.getApplicantService()
      const applicant = await ApplicantService.getApplicantById(id)
      if (!applicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`))
      }
      res.status(200).json(applicant)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Create a new applicant
  async createApplicant(req, res, next) {
    const ApplicantService = databaseService.getApplicantService()
    try {
      const ApplicantData = req.body
      // Check if all required fields are present in the request body
      if (!ApplicantData) {
        throw new ValidationError('Missing required fields.')
      }
      const newApplicant = await ApplicantService.createApplicant(ApplicantData)
      res.status(201).json(newApplicant)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Update an existing applicant
  async updateApplicant(req, res, next) {
    // try {
      const ApplicantService = databaseService.getApplicantService()
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const id = req.params.id
      const ApplicantData = req.body
      const updatedApplicant = await ApplicantService.updateApplicant(id, ApplicantData)

      if (!updatedApplicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`))
      }

      res.status(200).json(updatedApplicant)
    // } catch (error) {
    //   next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    // }
  }
  async updateApplicantAccredited(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const id = Number(req.params.id)
      const updatedApplicant = await ApplicantService.updateApplicantAccredited(id)

      if (!updatedApplicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`))
      }

      res.status(200).json(updatedApplicant)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Delete an applicant by ID
  //-
  async deleteApplicant(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const id = req.params.id
      const deletedApplicantName = await ApplicantService.deleteApplicant(id)

      res.status(200).json({
        message: `The applicant '${deletedApplicantName}' has been successfully deleted`
      })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
  //--
  async countAllApplicants(req, res,next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const count = await ApplicantService.countAllApplicants()
      res.json({ count })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  //no need
  async getApplicantMonthlyGenderCounts(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const applicantMonthlyGenderCountsWithSquareCount =
        await ApplicantService.getApplicantMonthlyGenderCounts()
      res.json({ applicantMonthlyGenderCountsWithSquareCount })
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  // --

  //**************************************************************************** */

  //--
  async getAllAccreditedAfterDismissal(req, res,next) {
    // try {
      const ApplicantService = databaseService.getApplicantService()
      const filterParams = req.query

      const applicants = await ApplicantService.getAllAccreditedAfterDismissal(filterParams)
      res.status(200).json(applicants)
    // } catch (error) {
    //   next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    // }
  }


  //**************************************************************************** */

  //--

}

module.exports = new ApplicantController()
