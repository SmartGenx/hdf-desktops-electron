const Router = require("express");
const squareRouter = Router();
const SquareController = require("../controllers/SquareControllers"); // Ensure you have a SquareController

// Create a new square
squareRouter.post('/', SquareController.createSquare);

// Update an existing square
squareRouter.put('/:id', SquareController.updateSquare);

// Get all squares
squareRouter.get('/', SquareController.getAllSquares);

// Get a square by ID
squareRouter.get('/:id', SquareController.getSquareById);

// Delete a square by ID
squareRouter.delete('/:id', SquareController.deleteSquare);

module.exports = { squareRouter }; // Export the router directly with the correct case
