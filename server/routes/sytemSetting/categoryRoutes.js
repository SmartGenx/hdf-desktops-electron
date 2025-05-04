const Router = require("express");
const categoryRouter = Router();
const CategoryController = require("../../controllers/systemSetting/categoryControllers"); // Ensure you have a CategoryController

// Create a new category
categoryRouter.post('/', CategoryController.createCategory);

// Update an existing category
categoryRouter.put('/:id', CategoryController.updateCategory);

// Get all categories
categoryRouter.get('/', CategoryController.getAllCategories);

// Get a category by ID
categoryRouter.get('/:id', CategoryController.getCategoryById);

// Delete a category by ID
categoryRouter.delete('/:id', CategoryController.deleteCategory);

module.exports = { categoryRouter }; // Export the router directly with the correct case
