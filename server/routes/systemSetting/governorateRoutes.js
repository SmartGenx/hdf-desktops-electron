const { Router } = require("express");
const GovernorateController = require("../../controllers/systemSetting/governorateControllers"); // Ensure you have a GovernorateController

const governorateRouter = Router();

// Create a new governorate
governorateRouter.post('/', GovernorateController.createGovernorate);

// Update an existing governorate
governorateRouter.put('/:id', GovernorateController.updateGovernorate);

// Get all governorates
governorateRouter.get('/', GovernorateController.getAllGovernorates);

// Get a governorate by ID
governorateRouter.get('/:id', GovernorateController.getGovernorateById);

// Delete a governorate by ID
governorateRouter.delete('/:id', GovernorateController.deleteGovernorate);

module.exports = { governorateRouter };
