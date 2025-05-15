import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import PrescriptionController  from '../../controllers/accreditation/prescriptionController';
import { upload, copyFileToProfileDir } from '../../middleware/uploadLoacl';

const prescriptionRouter = Router();

prescriptionRouter.post(
  '/',
  upload.single('file'),
(copyFileToProfileDir as unknown) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) => PrescriptionController.createPrescription(req, res, next)
);

prescriptionRouter.put(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => PrescriptionController.updatePrescription(req, res, next)
);

prescriptionRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => PrescriptionController.getAllPrescription(req, res, next)
);

prescriptionRouter.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => PrescriptionController.getPrescriptionById(req, res, next)
);

prescriptionRouter.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => PrescriptionController.deletePrescription(req, res, next)
);

export { prescriptionRouter };