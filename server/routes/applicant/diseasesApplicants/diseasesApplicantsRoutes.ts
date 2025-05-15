import { Router, Request, Response, NextFunction } from "express";
import  DiseasesApplicantsController  from "../../../controllers/applicant/diseasesApplicants/diseasesApplicantsControllers";

const diseasesApplicantsRouter = Router();

// Create a new diseases applicants entry
diseasesApplicantsRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  DiseasesApplicantsController.createDiseasesApplicants(req, res, next);
});

// Update an existing diseases applicants entry
diseasesApplicantsRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  DiseasesApplicantsController.updateDiseasesApplicants(req, res, next);
});

// Get all diseases applicants entries
diseasesApplicantsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  DiseasesApplicantsController.getAllDiseasesApplicants(req, res, next);
});

// Get a diseases applicants entry by ID
diseasesApplicantsRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  DiseasesApplicantsController.getDiseasesApplicantsById(req, res, next);
});

// Delete a diseases applicants entry by ID
diseasesApplicantsRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  DiseasesApplicantsController.deleteDiseasesApplicants(req, res, next);
});

export { diseasesApplicantsRouter };