const Router = require("express");
const roleRouter = Router();
const RoleController = require("../controllers/roleControllers"); // Ensure you have a RoleController

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

module.exports = { roleRouter }; // Export the router directly with the correct case
