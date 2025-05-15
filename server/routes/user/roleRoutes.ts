import { Router } from 'express';
import RoleController from '../../controllers/user/roleControllers';

const roleRouter = Router();

// Create a new role
roleRouter.post('/', RoleController.createRole);

// Update an existing role
roleRouter.put('/:id', RoleController.updateRole);

// Get all roles
roleRouter.get('/', RoleController.getAllRoles);

// Get a role by ID
roleRouter.get('/:id', RoleController.getRoleById);

// Delete a role by ID
roleRouter.delete('/:id', RoleController.deleteRole);

export { roleRouter };
