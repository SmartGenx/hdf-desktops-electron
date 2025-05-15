import { Router } from 'express';
import syncProcessControllers from '../../controllers/systemSetting/syncProcessControllers';

const syncProcessRouter = Router();

// syncProcessRouter.post('/', upload.single("file"),
//     copyFileToProfileDir(), syncProcessControllers.createsyncProcess);
syncProcessRouter.post('/', syncProcessControllers.synchronizeAll);
syncProcessRouter.get('/', syncProcessControllers.checkPendingSyncData);

export { syncProcessRouter };
