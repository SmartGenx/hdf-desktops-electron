import { Router, Request, Response, NextFunction } from "express";
import  ApplicantController  from "../../controllers/applicant/applicantControllers";

const applicantRouter = Router();

// Create a new applicant
applicantRouter.post('/', (req: Request, res: Response, next: NextFunction) => ApplicantController.createApplicant(req, res, next));

// Update an existing applicant
applicantRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => ApplicantController.updateApplicant(req, res, next));
applicantRouter.put('/ApplicantAccredited/:id', (req: Request, res: Response, next: NextFunction) => ApplicantController.updateApplicantAccredited(req, res, next));

// Get all applicants
applicantRouter.get('/', (req: Request, res: Response, next: NextFunction) => ApplicantController.getAllOrSearchApplicants(req, res, next));
applicantRouter.get('/update', (req: Request, res: Response, next: NextFunction) => ApplicantController.getAllApplicantsUseUpdate(req, res, next));

applicantRouter.get('/ApplicantByDirectorateViewModel', (req: Request, res: Response, next: NextFunction) => ApplicantController.getAllAccreditedAfterDismissal(req, res, next));
applicantRouter.get('/applicantsReportCategory', (req: Request, res: Response, next: NextFunction) => ApplicantController.ApplicantReportCategory(req, res, next));
applicantRouter.get('/count', (req: Request, res: Response, next: NextFunction) => ApplicantController.countAllApplicants(req, res, next));
applicantRouter.get('/ApplicantMonthlyGenderCount', (req: Request, res: Response, next: NextFunction) => ApplicantController.getApplicantMonthlyGenderCounts(req, res, next));
// Get an applicant by ID
applicantRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => ApplicantController.getApplicantById(req, res, next));

// Delete an applicant by ID
applicantRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => ApplicantController.deleteApplicant(req, res, next));

export { applicantRouter };