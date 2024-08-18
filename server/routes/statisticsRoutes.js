const Router = require("express");
const statisticsRouter = Router();
const statisticsControllers = require("../controllers/statisticsControllers"); // Ensure you have a statisticsControllers



// Get all squares
statisticsRouter.get('/', statisticsControllers.getAllstatisticsDismissals);
statisticsRouter.get('/Initialization', statisticsControllers.getStatisticsInitialization);



module.exports = { statisticsRouter }; // Export the router directly with the correct case
