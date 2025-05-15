import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class RoleController {
  // Fetch all roles
  async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const RoleService = databaseService.getRoleService();
      const roles = await RoleService.getAllRoles();
      res.status(200).json(roles);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single role by its ID
  async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: number = Number(req.params.id);
      const RoleService = databaseService.getRoleService();
      const role = await RoleService.getRoleById(id);
      if (!role) {
        return next(new NotFoundError(`Role with id ${id} not found.`));
      }
      res.status(200).json(role);
    } catch (error: any) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new role
  async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const RoleService = databaseService.getRoleService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const { name } = req.body;
      const newRole = await RoleService.createRole(name);
      res.status(201).json(newRole);
    } catch (error: any) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Update an existing role
  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const RoleService = databaseService.getRoleService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const id: number = Number(req.params.id);
      const { name, synchronized, deleted } = req.body;
      const updatedRole = await RoleService.updateRole(id, name, synchronized, deleted);
      if (!updatedRole) {
        return next(new NotFoundError(`Role with id ${id} not found.`));
      }
      res.status(200).json(updatedRole);
    } catch (error: any) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Delete a role by ID
  async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const RoleService = databaseService.getRoleService();
      const id: number = Number(req.params.id);
      const deletedRoleName = await RoleService.deleteRole(id);
      res.status(200).json({ message: `The role '${deletedRoleName}' has been successfully deleted` });
    } catch (error: any) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new RoleController();