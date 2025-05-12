const  Router  = require("express");
const directorateRouter = Router();
const DirectorateController = require("../../controllers/systemSetting/directorateControllers"); // Ensure you have a DirectorateController

// Create a new directorate
directorateRouter.post('/', DirectorateController.createDirectorate);

// Update an existing directorate
directorateRouter.put('/:id', DirectorateController.updateDirectorate);

// Get all directorates
directorateRouter.get('/', DirectorateController.getAllDirectorates);

// Get a directorate by ID
directorateRouter.get('/:id', DirectorateController.getDirectorateById);

// Delete a directorate by ID
directorateRouter.delete('/:id', DirectorateController.deleteDirectorate);

module.exports = {directorateRouter}; // Export the router directly with the correct case
