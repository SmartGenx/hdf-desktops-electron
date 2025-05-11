import { PrismaClient, Square } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

interface SquareInput {
  name: string;
}

export default class SquareService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllSquares(): Promise<Square[]> {
    try {
      return await this.prisma.square.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving squares.', error);
    }
  }

  async getSquareById(id: string): Promise<Square> {
    try {
      const square = await this.prisma.square.findUnique({ where: { globalId: id } });
      if (!square) {
        throw new NotFoundError(`Square with id ${id} not found.`);
      }
      return square;
    } catch (error) {
      throw new DatabaseError('Error retrieving square.', error);
    }
  }

  async createSquare(name: string): Promise<Square> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;

      const existing = await this.prisma.square.findFirst({ where: { name } });
      if (existing) {
        throw new ValidationError(`هذي المربع ${name} موجودة بالفعل`);
      }

      return await this.prisma.square.create({
        data: { name, globalId },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A square with the name '${name}' already exists.`);
      } else if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new DatabaseError('Error creating new square.', error);
      }
    }
  }

  async updateSquare(id: string, data: SquareInput): Promise<Square> {
    try {
      const existingSquare = await this.prisma.square.findUnique({ where: { globalId: id } });
      if (!existingSquare) {
        throw new NotFoundError(`Square with id ${id} not found.`);
      }

      const existingName = await this.prisma.square.findFirst({ where: { name: data.name } });
      if (existingName && existingName.globalId !== id) {
        throw new ValidationError(`هذي المربع ${data.name} موجودة بالفعل`);
      }

      return await this.prisma.square.update({
        where: { globalId: id },
        data: { ...data, version: { increment: 1 } },
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Error updating square.', error);
    }
  }

  async deleteSquare(id: string): Promise<string> {
    try {
      const square = await this.prisma.square.findUnique({ where: { globalId: id } });
      if (!square) {
        throw new NotFoundError(`Square with id ${id} not found.`);
      }

      await this.prisma.square.update({
        where: { globalId: id },
        data: { deleted: true, version: { increment: 1 } },
      });

      return square.name;
    } catch (error) {
      throw new DatabaseError('Error deleting square.', error);
    }
  }
}
