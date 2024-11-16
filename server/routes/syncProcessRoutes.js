const Router = require('express');
const syncProcessControllers = require('../controllers/syncProcessControllers');


const syncProcessRouter = Router();

// syncProcessRouter.post('/', upload.single("file"),
//     copyFileToProfileDir(), syncProcessControllers.createsyncProcess);
syncProcessRouter.post('/', syncProcessControllers.synchronizeAll);


module.exports = { syncProcessRouter };
