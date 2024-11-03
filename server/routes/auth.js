const Router = require('express')
const { authMiddleware } = require('../middleware/auth')
const { adminMiddleware } = require('../middleware/admin')
const AuthController = require('../controllers/auth')
const { upload, copyFileToProfileDir } = require('../middleware/uploadLoacl') // Ensure you have an AttachmentController

const authRouter = Router()

authRouter.post('/signup', upload.single('file'), copyFileToProfileDir(), AuthController.signup)
authRouter.post('/login', AuthController.login)
authRouter.get('/searchUser', AuthController.getAllSearchUsers)
authRouter.put('/user/:id', AuthController.updateUser)
authRouter.delete('/user/:id', AuthController.deleteUser)
authRouter.get('/user/:id', AuthController.getUserById)
authRouter.post('/forgot-password', AuthController.forgotPassword)
authRouter.post('/reset-password', AuthController.resetPassword)

module.exports = { authRouter }
