import { Router, Request, Response } from "express";
import statisticsControllers from "../../controllers/reports/statisticsControllers";

const statisticsRouter = Router();

// Get all squares
statisticsRouter.get('/', (req: Request, res: Response, next) => statisticsControllers.getAllstatisticsDismissals(req, res, next));
statisticsRouter.get('/Initialization', (req: Request, res: Response, next) => statisticsControllers.getStatisticsInitialization(req, res, next));

export { statisticsRouter };