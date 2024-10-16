const Router = require("express");
const backUpRouter = Router();


const { backupDatabase } = require('../utilty/utility');

backUpRouter.post('/', backupDatabase);

module.exports = { backUpRouter }; // Export the router directly with the correct case
