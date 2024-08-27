const Router = require('express')
const dismissalRouter = Router()
const DismissalController = require('../controllers/dismissalControllers') // Ensure you have a DismissalController

// Update an existing dismissal
dismissalRouter.put('/:id', DismissalController.updateDismissal)

// Get all dismissals
dismissalRouter.get('/', DismissalController.getAllDismissals)
dismissalRouter.post('', DismissalController.createDismissal)

// Get a dismissal by ID
dismissalRouter.get('/:id', DismissalController.getDismissalById)

// Delete a dismissal by ID
dismissalRouter.delete('/:id', DismissalController.deleteDismissal)

module.exports = { dismissalRouter } // Export the router directly with the correct case
