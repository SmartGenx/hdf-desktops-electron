import { RequestHandler, Router } from 'express';
// import { authMiddleware } from '../middleware/auth';
// import { adminMiddleware } from '../middleware/admin';
import AuthController from '../../controllers/user/auth';
import { upload, copyFileToProfileDir } from '../../middleware/uploadLoacl';

const authRouter = Router();

authRouter.post('/signup', upload.single('file'), (copyFileToProfileDir as unknown) as RequestHandler,
 AuthController.signup);
authRouter.post('/login', AuthController.login);
authRouter.get('/searchUser', AuthController.getAllSearchUsers);
authRouter.put('/user/:id', AuthController.updateUser);
authRouter.delete('/user/:id', AuthController.deleteUser);
authRouter.get('/user/:id', AuthController.getUserById);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/reset-password', AuthController.resetPassword);

export { authRouter };
