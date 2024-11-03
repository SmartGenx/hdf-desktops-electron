const { databaseService } = require('../database'); // Adjust the import path as needed
const { validationResult } = require('express-validator');
const ApiError = require('../errors/ApiError');
const DatabaseError = require('../errors/DatabaseError');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

class RoleController {
  // Fetch all roles
  async getAllRoles(req, res, next) {
    try {
      const RoleService = databaseService.getRoleService();
      const roles = await RoleService.getAllRoles();
      res.status(200).json(roles);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Fetch a single role by its ID
  async getRoleById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const RoleService = databaseService.getRoleService();
      const role = await RoleService.getRoleById(id);
      if (!role) {
        return next(new NotFoundError(`Role with id ${id} not found.`));
      }
      res.status(200).json(role);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Create a new role
  async createRole(req, res, next) {
    try {
      const RoleService = databaseService.getRoleService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const { name } = req.body;
      const newRole = await RoleService.createRole(name);

      res.status(201).json(newRole);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Update an existing role
  async updateRole(req, res, next) {
    try {
      const RoleService = databaseService.getRoleService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const id = Number(req.params.id);
      const { name, synchronized, deleted } = req.body;
      const updatedRole = await RoleService.updateRole(id, name, synchronized, deleted);

      if (!updatedRole) {
        return next(new NotFoundError(`Role with id ${id} not found.`));
      }

      res.status(200).json(updatedRole);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  // Delete a role by ID
  async deleteRole(req, res, next) {
    try {
      const RoleService = databaseService.getRoleService();
      const id = Number(req.params.id);
      const deletedRoleName = await RoleService.deleteRole(id);

      res.status(200).json({ message: `The role '${deletedRoleName}' has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

module.exports = new RoleController();
