const Router = require('express');
const prescriptionRouter = Router();
const PrescriptionController = require('../controllers/prescriptionController'); // Ensure you have an AttachmentController
const { upload, copyFileToProfileDir } = require('../middleware/uploadLoacl'); // Ensure you have an AttachmentController

// Create a new attachment
prescriptionRouter.post(
	'/',
	upload.single('file'),
	// uploadFileToS3("smartgenx"),
	copyFileToProfileDir(),
	PrescriptionController.createPrescription
);

// Update an existing attachment
prescriptionRouter.put('/:id', PrescriptionController.updatePrescription);

// Get all attachments
prescriptionRouter.get('/', PrescriptionController.getAllPrescription);

// Get an attachment by ID
prescriptionRouter.get('/:id', PrescriptionController.getPrescriptionById);
// Delete an attachment by ID
prescriptionRouter.delete('/:id', PrescriptionController.deletePrescription);

module.exports = { prescriptionRouter }; // Export the router directly with the correct case
