const { databaseService } = require('../database') // Adjust the import path as needed
const { validationResult } = require('express-validator')
const ApiError = require('../errors/ApiError')
const DatabaseError = require('../errors/DatabaseError')
const ValidationError = require('../errors/ValidationError')
const NotFoundError = require('../errors/NotFoundError')
const path = require('path')
const fs = require('fs')
class AccreditedController {
  // Fetch all accreditations
  async fileUploadController(req, res, next) {
    try {
      const { sourcePath, localDir, accreditedId, bucketName } = req.body // Extracting data from request body
      // Call your function with the extracted parameters
      const result = await uploadOrSaveFile(sourcePath, localDir, accreditedId, bucketName)
      // Send a success response with the result
      res.status(200).json({ message: result })
    } catch (error) {
      // Log the error and send an error response
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
  async filterAccredited(req, res, next) {
    try {
      // Extract query parameters from the request
      const { squareId, location, docter, state } = req.query

      // Convert squareId to an integer if present
      const squareIdv = parseInt(squareId, 10)

      // Assuming you have a service for Accredited similar to ApplicantService
      const AccreditedService = databaseService.getAccreditedService()

      // Call the service function with the query parameters
      const accreditedRecords = await AccreditedService.filterAccreditedByDateAndLocation(
        squareIdv,
        location,
        docter,
        state
      )

      // Respond with the filtered list of accredited records
      res.json(accreditedRecords)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async getAllOrSearchApplicants(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const searchTerm = req.query // Assuming the search term comes as a query parameter
      const Accredited = await AccreditedService.searchAccreditations(searchTerm)
      res.status(200).json(Accredited)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
  async getAllApplicants(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const searchTerm = req.query // Assuming the search term comes as a query parameter
      const Accredited = await AccreditedService.getAllAccreditations(searchTerm)
      res.status(200).json(Accredited)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Fetch a single accreditation by its ID
  async getAccreditationById(req, res, next) {
    const id = req.params.id
    const AccreditedService = databaseService.getAccreditedService()

    try {
      const accreditation = await AccreditedService.getAccreditationById(id)
      if (!accreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`))
      }
      res.status(200).json(accreditation)
    } catch (error) {
      next(error)
    }
  }

  async countAllAccredited(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      const count = await AccreditedService.countAllAccredited()
      res.json({ count })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Create a new accreditation
  async createAccreditation(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const fileAtch = req.atch
      const filePt = req.pt
      const AccreditedData = req.body
      const newAccreditation = await AccreditedService.createAccreditation(
        AccreditedData,
        fileAtch,
        filePt
      )

      res.status(201).json(newAccreditation)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
  async getPrintAccreditationById(req, res, next) {
    try {
      const id = req.params.id;
      const AccreditedService = databaseService.getAccreditedService();
      const accreditation = await AccreditedService.getPrintAccreditationById(id);
      res.status(200).json(accreditation);
    } catch (error) {
      console.error('Controller Error:', error); 
      next(new DatabaseError('Failed to retrieve accreditation', error));
    }
  }
  // Update an existing accreditation
  async updateAccreditation(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    // try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const fileAtch = req.atch
      const filePt = req.pt

      const id = req.params.id
      const AccreditedData = req.body
      const updatedAccreditation = await AccreditedService.updateAccreditation(id, AccreditedData,fileAtch, filePt)

      if (!updatedAccreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`))
      }

      res.status(200).json(updatedAccreditation)
    // } catch (error) {
    //   next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    // }
  }
  async updateAccreditationState(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const id = req.params.id
      const { state } = req.body

      const updatedAccreditation = await AccreditedService.updateAccreditationState(id, state)

      if (!updatedAccreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`))
      }

      res.status(200).json(updatedAccreditation)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Delete an accreditation by ID
  async deleteAccreditation(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      // Extract the accreditation ID from the request parameters and convert it to a number
      const id = req.params.id
      // Use the AccreditedService to delete the accreditation by ID and retrieve the name of the deleted accreditation
      const name = await AccreditedService.deleteAccreditation(id)
      // Send a success response with the name of the deleted accreditation
      res.status(200).json({
        message: `The accreditation '${name}' has been successfully deleted`
      })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async AccreditedByPrescription(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      // Ensure that 'directorateId' is correctly extracted from the request parameters
      // 'req.params' is an object, so you need to specify the key to get the desired parameter
      // // Assuming the route parameter is named 'directorateId' as in '/someRoute/:directorateId'

      const Accredited = await AccreditedService.AccreditedByPrescriptionServer()
      res.status(200).json(Accredited)
    } catch (error) {
      // Pass the error to the error handling middleware
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async exportAllBarcodeCardToPDFById(req, res, next) {
    try {
      // Example object (in real scenario, fetch this from your database)
      const id = req.params.id
      const AccreditedService = databaseService.getAccreditedService()
      const accredited = await AccreditedService.getAccreditationById(id)
      const dta = {
        number: accredited.numberOfRfid
      }
      res.status(200).send(dta)

    } catch (error) {
      next(new ApiError(500, 'InternalServer', error))
    }
  }

  async exportAllBarcodeCardToPDF(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const accrediteds = await AccreditedService.getAllAccreditations()
      let card = []
      for (const data of accrediteds) {
        card.push({ number: data.numberOfRfid,
          formNumber: data.formNumber
         })
      }
      res.status(200).json(card)


    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async AccreditedByPrescriptionServers(req, res, next) {
    // try {
      const AccreditedService = databaseService.getAccreditedService()
      const dataFilter = req.query

      const accrediteds = await AccreditedService.AccreditedByPrescriptionServer(dataFilter)
      res.status(200).json(accrediteds)
    // } catch (error) {
    //   next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    // }
  }




}

module.exports = new AccreditedController()
