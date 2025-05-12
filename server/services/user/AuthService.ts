import { PrismaClient, User as UserModel } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { JWT_SECRET } from '../../secrets';
import DatabaseError from '../../errors/DatabaseError';

dotenv.config();

type UserLoginResult = {
  token: string;
  user: {
    role: string;
    name: string;
    email: string;
    profileImage: string | null;
  };
};

export default class AuthService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async signup(
    name: string,
    email: string,
    password: string,
    roleGlobalId: string,
    phone: string,
    address: string,
    profileImage: string | null
  ): Promise<UserModel> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`;
      const hashedPassword = await hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          roleGlobalId,
          phone,
          address,
          profileImage,
          globalId,
          deleted: false
        }
      });

      return newUser;
    } catch (error: any) {
      console.error(error);
      throw new DatabaseError('Error signing up user.', error);
    }
  }

  async login(email: string, password: string): Promise<UserLoginResult> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });

      if (!existingUser) throw new Error('Invalid email');

      const passwordValid = await compare(password, existingUser.password);
      if (!passwordValid) throw new Error('Invalid email or password');

      const token = jwt.sign({ userId: existingUser.id, name: existingUser.name }, JWT_SECRET);

      return {
        token,
        user: {
          role: existingUser.role.name,
          name: existingUser.name,
          email: existingUser.email,
          profileImage: existingUser.profileImage
        }
      };
    } catch (error: any) {
      console.error(error);
      throw new DatabaseError('Error logging in user.', error);
    }
  }

  async getAllUser(userFilter: any): Promise<UserModel[]> {
    try {
      return await this.prisma.user.findMany({
        where: { ...userFilter, deleted: false },
        include: { role: true }
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Error getting users.', error);
    }
  }

  async searchUser(searchTerm: string): Promise<UserModel[]> {
    try {
      return await this.prisma.user.findMany({
        where: {
          OR: [{ name: { contains: searchTerm } }]
        }
      });
    } catch (error) {
      throw new DatabaseError('Error searching users.', error);
    }
  }

  async updateUser(globalId: string, updateData: any): Promise<UserModel> {
    try {
      return await this.prisma.user.update({
        where: { globalId },
        data: {
          ...updateData,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Error updating user.', error);
    }
  }

  async deleteUser(globalId: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { globalId },
        data: {
          deleted: true,
          version: { increment: 1 }
        }
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Error deleting user.', error);
    }
  }

  async getUserById(globalId: string): Promise<UserModel> {
    try {
      const user = await this.prisma.user.findUnique({ where: { globalId } });
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Error fetching user by ID.', error);
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return {
          message: 'If a user with that email exists, we have sent a reset link to your email.'
        };
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      await this.prisma.user.update({
        where: { email },
        data: {
          resetToken: resetTokenHash,
          resetTokenExpiry: new Date(Date.now() + 3600000)
        }
      });

      return {
        message: `http://localhost:3000/api/auth/reset-password?resetToken=${encodeURIComponent(
          resetToken
        )}&newPassword`
      };
    } catch (error) {
      throw new DatabaseError('Error processing forgot password.', error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const user = await this.prisma.user.findFirst({
        where: {
          resetToken: resetTokenHash,
          resetTokenExpiry: { gt: new Date() }
        }
      });

      if (!user) throw new Error('Token is invalid or has expired.');

      const hashedPassword = await hash(newPassword, 10);

      await this.prisma.user.update({
        where: { globalId: user.globalId },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      });

      return { message: 'Your password has been reset successfully.' };
    } catch (error) {
      throw new DatabaseError('Error resetting password.', error);
    }
  }
}
