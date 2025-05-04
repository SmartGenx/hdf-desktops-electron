const Router = require("express");
const diseaseRouter = Router();
const DiseaseController = require("../../controllers/systemSetting/diseaseControllers"); // Ensure you have a DiseaseController
 
// Create a new disease
diseaseRouter.post('/', DiseaseController.createDisease);

// Update an existing disease
diseaseRouter.put('/:id', DiseaseController.updateDisease);

// Get all diseases
diseaseRouter.get('/', DiseaseController.getAllDiseases);

// Get a disease by ID
diseaseRouter.get('/:id', DiseaseController.getDiseaseById);

// Delete a disease by ID
diseaseRouter.delete('/:id', DiseaseController.deleteDisease);

module.exports = { diseaseRouter }; // Export the router directly with the correct case
