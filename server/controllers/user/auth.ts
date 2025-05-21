import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import {ApiError} from '../../errors/ApiError';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        roleGlobalId,
        phone,
        address,
      } = req.body;

      const authService = databaseService.getAuthService();

      // Assuming req.file is of type Express.Multer.File & has extra properties
      const file = req.file as any;
      const profileImage: string = file.local ? file.local : file.s3.Location;

      const newUser = await authService.signup(
        name,
        email,
        password,
        roleGlobalId,
        phone,
        address,
        profileImage
      );
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message === 'User already exists') {
          res.status(401).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal Server Error' });
        }
      } else {
        console.error('Caught an unknown error:', error);
        next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      }
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const authService = databaseService.getAuthService();

      const user = await authService.login(email, password);
      req.user = user;
      res.status(201).json(user);
      next();
    } catch (error: any) {
      if (error instanceof Error) {
        if (
          error.message === 'Invalid email' ||
          error.message === 'Invalid email or password'
        ) {
          res.status(401).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Internal Server Error' });
        }
      } else {
        next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      }
    }
  }

  async getAllSearchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authService = databaseService.getAuthService();
    const userfilter = req.query;
    try {
      const applicants = await authService.getAllUser(userfilter);
      res.status(200).json(applicants);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const authService = databaseService.getAuthService();

      const updatedUser = await authService.updateUser(userId, updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const authService = databaseService.getAuthService();

      await authService.deleteUser(userId);
      res.status(204).json({ message: 'delete successful' });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id;
      const authService = databaseService.getAuthService();

      const user = await authService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const authService = databaseService.getAuthService();

      const response = await authService.forgotPassword(email);
      res.status(200).json(response);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resetToken, newPassword } = req.body;
      if (!resetToken || !newPassword) {
        res.status(400).json({ message: 'Missing resetToken or newPassword in request' });
        return;
      }
      const authService = databaseService.getAuthService();

      const user = await authService.resetPassword(resetToken, newPassword);
      res.status(200).json({ message: 'Password successfully reset', user });
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new AuthController();
