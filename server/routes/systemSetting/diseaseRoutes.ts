import { Router, Request, Response, NextFunction } from "express";
import  DiseaseController  from "../../controllers/systemSetting/diseaseControllers";

const diseaseRouter = Router();

// Create a new disease
diseaseRouter.post('/', (req: Request, res: Response, next: NextFunction) => DiseaseController.createDisease(req, res, next));

// Update an existing disease
diseaseRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => DiseaseController.updateDisease(req, res, next));

// Get all diseases
diseaseRouter.get('/', (req: Request, res: Response, next: NextFunction) => DiseaseController.getAllDiseases(req, res, next));

// Get a disease by ID
diseaseRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => DiseaseController.getDiseaseById(req, res, next));

// Delete a disease by ID
diseaseRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => DiseaseController.deleteDisease(req, res, next));

export { diseaseRouter };
