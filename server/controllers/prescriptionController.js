const { databaseService } = require('../database') // Adjust the import path as needed
const { validationResult } = require('express-validator')
const ApiError = require('../errors/ApiError')
const DatabaseError = require('../errors/DatabaseError')
const ValidationError = require('../errors/ValidationError')
const NotFoundError = require('../errors/NotFoundError')
const { file } = require('pdfkit')

class PrescriptionController {
  // Fetch all attachments
  async getAllPrescription(req, res, next) {
    // try {
      const PrescriptionService = databaseService.getPrescriptionService()
      const fillterData = req.query
      const attachments = await PrescriptionService.getAllPrescriptions(fillterData)
      res.status(200).json(attachments)
    // } catch (error) {
    //   console.error(error)
    //   next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    // }
  }

  // Fetch a single attachment by its ID
  async getPrescriptionById(req, res, next) {
    try {
      const id = req.params.id
      const PrescriptionService = databaseService.getPrescriptionService()
      const attachment = await PrescriptionService.getPrescriptionById(id)
      if (!attachment) {
        return next(new NotFoundError(`Attachment with id ${id} not found.`))
      }
      res.status(200).json(attachment)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Create a new attachment
  async createPrescription(req, res, next) {
    try {
      const PrescriptionService = databaseService.getPrescriptionService()
      const errors = validationResult(req) // Assuming `validationResult` comes from an express validator middleware
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const filePath = req.file.local ? req.file.local : req.file.s3.Location
      const PrescriptionDatas = req.body
      const newPrescription = await PrescriptionService.createPrescription(
        PrescriptionDatas,
        filePath
      )
      res.status(201).json(newPrescription)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Update an existing attachment
  async updatePrescription(req, res, next) {
    try {
      const PrescriptionService = databaseService.getPrescriptionService()
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const id = req.params.id
      const PrescriptionData = req.body
      const updatedAttachment = await PrescriptionService.updatePrescription(id, PrescriptionData)

      if (!updatedAttachment) {
        return next(new NotFoundError(`Attachment with id ${id} not found.`))
      }

      res.status(200).json(updatedAttachment)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Delete an attachment by ID
  async deletePrescription(req, res, next) {
    try {
      const PrescriptionService = databaseService.getPrescriptionService()
      const id = req.params.id
      await PrescriptionService.deletePrescription(id)

      res
        .status(200)
        .json({ message: `The attachment with id ${id} has been successfully deleted` })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
}

module.exports = new PrescriptionController()
