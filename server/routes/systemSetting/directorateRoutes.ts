import { Router, Request, Response, NextFunction } from "express";
import DirectorateController from "../../controllers/systemSetting/directorateControllers";

const directorateRouter = Router();

directorateRouter.post('/', (req: Request, res: Response, next: NextFunction) => DirectorateController.createDirectorate(req, res, next));
directorateRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => DirectorateController.updateDirectorate(req, res, next));
directorateRouter.get('/', (req: Request, res: Response, next: NextFunction) => DirectorateController.getAllDirectorates(req, res, next));
directorateRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => DirectorateController.getDirectorateById(req, res, next));
directorateRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => DirectorateController.deleteDirectorate(req, res, next));

export { directorateRouter };
