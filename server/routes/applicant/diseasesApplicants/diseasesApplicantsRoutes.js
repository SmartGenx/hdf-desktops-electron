const Router = require("express");
const diseasesApplicantsRouter = Router();
const DiseasesApplicantsController = require("../../../controllers/diseasesApplicantsControllers"); // Ensure you have a DiseasesApplicantsController

// Create a new diseases applicants entry
diseasesApplicantsRouter.post('/', DiseasesApplicantsController.createDiseasesApplicants);

// Update an existing diseases applicants entry
diseasesApplicantsRouter.put('/:id', DiseasesApplicantsController.updateDiseasesApplicants);

// Get all diseases applicants entries
diseasesApplicantsRouter.get('/', DiseasesApplicantsController.getAllDiseasesApplicants);

// Get a diseases applicants entry by ID
diseasesApplicantsRouter.get('/:id', DiseasesApplicantsController.getDiseasesApplicantsById);

// Delete a diseases applicants entry by ID
diseasesApplicantsRouter.delete('/:id', DiseasesApplicantsController.deleteDiseasesApplicants);

module.exports = { diseasesApplicantsRouter }; // Export the router directly with the correct case
