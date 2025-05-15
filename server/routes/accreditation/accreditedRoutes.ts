import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import  AccreditedController from '../../controllers/accreditation/accreditedControllers';
import { upload, copyFileToProfileDir } from '../../middleware/uploadLoacl';

const accreditedRouter = Router();

const fields = [
  { name: 'atch', maxCount: 1 },
  { name: 'pt', maxCount: 1 }
];

// Create a new accreditation
accreditedRouter.post(
  '/',
  upload.fields(fields),
  (copyFileToProfileDir as unknown) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) => AccreditedController.createAccreditation(req, res, next)
);
accreditedRouter.post('/uploadFile', (req: Request, res: Response, next: NextFunction) => AccreditedController.fileUploadController(req, res, next));

// Update an existing accreditation
accreditedRouter.put(
  '/:id',
  upload.fields(fields),
  (copyFileToProfileDir as unknown) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) => AccreditedController.updateAccreditation(req, res, next)
);
// Get all accreditations
accreditedRouter.get('/', (req: Request, res: Response, next: NextFunction) => AccreditedController.getAllOrSearchApplicants(req, res, next));
accreditedRouter.get('/all', (req: Request, res: Response, next: NextFunction) => AccreditedController.getAllApplicants(req, res, next));

accreditedRouter.get('/AllAccreditedsForPdf', (req: Request, res: Response, next: NextFunction) => AccreditedController.AccreditedByPrescriptionServers(req, res, next));

accreditedRouter.get('/card', (req: Request, res: Response, next: NextFunction) => AccreditedController.exportAllBarcodeCardToPDF(req, res, next));
accreditedRouter.get('/card/:id', (req: Request, res: Response, next: NextFunction) => AccreditedController.exportAllBarcodeCardToPDFById(req, res, next));
accreditedRouter.get('/count', (req: Request, res: Response, next: NextFunction) => AccreditedController.countAllAccredited(req, res, next));

// Get an accreditation by ID
accreditedRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => AccreditedController.getAccreditationById(req, res, next));
accreditedRouter.get('/print/:id', (req: Request, res: Response, next: NextFunction) => AccreditedController.getPrintAccreditationById(req, res, next));

// Delete an accreditation by ID
accreditedRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => AccreditedController.deleteAccreditation(req, res, next));

export { accreditedRouter };