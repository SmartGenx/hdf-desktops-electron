const Router = require("express");
const backUpRouter = Router();
const backUpController = require("../controllers/backUpControllers"); // Ensure you have a backUpController
const {isAuthenticated}= require('../middleware/auth')



const { backupDatabase } = require('../utilty/utility');

backUpRouter.post('/', isAuthenticated,backupDatabase);
backUpRouter.get('/', backUpController.getbackup);
backUpRouter.post('/craete', backUpController.getcreate);

module.exports = { backUpRouter }; // Export the router directly with the correct case
