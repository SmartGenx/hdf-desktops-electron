const Router = require('express');
const syncProcessControllers = require('../../controllers/systemSetting/syncProcessControllers');


const syncProcessRouter = Router();

// syncProcessRouter.post('/', upload.single("file"),
//     copyFileToProfileDir(), syncProcessControllers.createsyncProcess);
syncProcessRouter.post('/', syncProcessControllers.synchronizeAll);
syncProcessRouter.get('/', syncProcessControllers.checkPendingSyncData);


module.exports = { syncProcessRouter };
