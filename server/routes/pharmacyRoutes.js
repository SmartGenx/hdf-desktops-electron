const Router = require("express");
const pharmacyRouter = Router();
const PharmacyController = require("../controllers/pharmacyControllers"); // Ensure you have a PharmacyController

// Create a new pharmacy
pharmacyRouter.post('/', PharmacyController.createPharmacy);

// Update an existing pharmacy
pharmacyRouter.put('/:id', PharmacyController.updatePharmacy);

// Get all pharmacies
pharmacyRouter.get('/', PharmacyController.getAllPharmacies);

// Get a pharmacy by ID
pharmacyRouter.get('/:id', PharmacyController.getPharmacyById);

// Delete a pharmacy by ID
pharmacyRouter.delete('/:id', PharmacyController.deletePharmacy);

module.exports = { pharmacyRouter }; // Export the router directly with the correct case
