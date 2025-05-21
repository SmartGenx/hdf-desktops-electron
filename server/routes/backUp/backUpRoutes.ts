import { Router } from "express";
import  backUpControllers from "../../controllers/backUp/backUpControllers";
import { backupDatabase } from "../../utilty/utility";

const backUpRouter = Router();

backUpRouter.post('/', backupDatabase);
backUpRouter.get('/', backUpControllers.getbackup);
backUpRouter.post('/craete', backUpControllers.getcreate);

export { backUpRouter };