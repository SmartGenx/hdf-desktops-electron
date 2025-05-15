import { Router, Request, Response, NextFunction } from "express";
import CategoryController from "../../controllers/systemSetting/categoryControllers";

const categoryRouter = Router();

// Create a new category
categoryRouter.post('/', (req: Request, res: Response, next: NextFunction) => CategoryController.createCategory(req, res, next));

// Update an existing category
categoryRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => CategoryController.updateCategory(req, res, next));

// Get all categories
categoryRouter.get('/', (req: Request, res: Response, next: NextFunction) => CategoryController.getAllCategories(req, res, next));

// Get a category by ID
categoryRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => CategoryController.getCategoryById(req, res, next));

// Delete a category by ID
categoryRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => CategoryController.deleteCategory(req, res, next));

export { categoryRouter };
