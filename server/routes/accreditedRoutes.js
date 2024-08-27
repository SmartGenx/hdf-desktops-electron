const Router = require('express')
const accreditedRouter = Router()
const AccreditedController = require('../controllers/accreditedControllers') // Ensure you have an AccreditedController
const { upload, copyFileToProfileDir } = require('../middleware/uploadLoacl') // Ensure you have an AttachmentController
const fields = [
  { name: 'atch', maxCount: 1 },
  { name: 'pt', maxCount: 1 }
]

// Create a new accreditation
accreditedRouter.post(
  '/',
  upload.fields(fields),
  copyFileToProfileDir(),
  AccreditedController.createAccreditation
)
accreditedRouter.post('/uploadFile', AccreditedController.fileUploadController)

// Update an existing accreditation
accreditedRouter.put('/:id', AccreditedController.updateAccreditation)
// Get all accreditations
accreditedRouter.get('/', AccreditedController.getAllOrSearchApplicants)
accreditedRouter.get('/all', AccreditedController.getAllApplicants)
accreditedRouter.get('/exportAllAccreditedsToPdf', AccreditedController.exportAllAccreditedsToPDF)
accreditedRouter.get(
  '/exportAllAccreditedsToPExcl',
  AccreditedController.exportAllAccreditedByPrescriptionToExcel
)
accreditedRouter.get('/AllAccreditedsForPdf', AccreditedController.AccreditedByPrescriptionServers)

accreditedRouter.get('/card', AccreditedController.exportAllBarcodeCardToPDF)
accreditedRouter.get('/card/:id', AccreditedController.exportAllBarcodeCardToPDFById)
accreditedRouter.get('/count', AccreditedController.countAllAccredited)

// Get an accreditation by ID
accreditedRouter.get('/:id', AccreditedController.getAccreditationById)

// Delete an accreditation by ID
accreditedRouter.delete('/:id', AccreditedController.deleteAccreditation)

module.exports = { accreditedRouter } // Export the router directly with the correct case
