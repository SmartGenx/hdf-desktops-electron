import { Router } from "express";
import SquareController from "../../controllers/systemSetting/squareControllers";

const squareRouter = Router();

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

export { squareRouter };
