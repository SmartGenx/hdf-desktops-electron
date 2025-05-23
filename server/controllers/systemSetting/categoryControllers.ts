import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class CategoryController {
  // Fetch all categories
  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const CategoryService = databaseService.getCategoryService();
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single category by its ID
  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.params.id;
      const CategoryService = databaseService.getCategoryService();
      const category = await CategoryService.getCategoryById(id);
      if (!category) {
        return next(new NotFoundError(`Category with id ${id} not found.`));
      }
      res.status(200).json(category);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new category
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const CategoryService = databaseService.getCategoryService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const { name, SupportRatio, description } = req.body;
      const newCategory = await CategoryService.createCategory(name, SupportRatio, description);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Update an existing category
  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const CategoryService = databaseService.getCategoryService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id: string = req.params.id;
      const data = req.body;
      const updatedCategory = await CategoryService.updateCategory(id, data);
      if (!updatedCategory) {
        return next(new NotFoundError(`Category with id ${id} not found.`));
      }
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: `${error}` });
    }
  }

  // Delete a category by ID
  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const CategoryService = databaseService.getCategoryService();
      const id: string = req.params.id;
      const deletedCategoryName = await CategoryService.deleteCategory(id);
      res.status(200).json({ message: `The category '${deletedCategoryName}' has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new CategoryController();