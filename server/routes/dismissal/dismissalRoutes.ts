import { Router, Request, Response, NextFunction } from 'express';
import DismissalController  from '../../controllers/dismissal/dismissalControllers';

const dismissalRouter = Router();

// Update an existing dismissal
dismissalRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => DismissalController.updateDismissal(req, res, next));

// Get all dismissals
dismissalRouter.get('/', (req: Request, res: Response, next: NextFunction) => DismissalController.getAllDismissals(req, res, next));
dismissalRouter.post('', (req: Request, res: Response, next: NextFunction) => DismissalController.createDismissal(req, res, next));
dismissalRouter.post('/check', (req: Request, res: Response, next: NextFunction) => DismissalController.checkDismissal(req, res, next));

// Get a dismissal by ID
dismissalRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => DismissalController.getDismissalById(req, res, next));

// Delete a dismissal by ID
dismissalRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => DismissalController.deleteDismissal(req, res, next));

export { dismissalRouter };