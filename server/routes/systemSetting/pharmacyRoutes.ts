import { Router } from "express";
import PharmacyController from "../../controllers/systemSetting/pharmacyControllers";

const pharmacyRouter = Router();

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

export { pharmacyRouter };
