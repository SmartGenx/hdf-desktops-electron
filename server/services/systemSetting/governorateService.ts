import { PrismaClient, Governorate } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import {ValidationError} from '../../errors/ValidationError';

export default class GovernorateService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllGovernorates(): Promise<Governorate[]> {
    try {
      return await this.prisma.governorate.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving governorates.', error);
    }
  }

  async getGovernorateById(id: string): Promise<Governorate> {
    try {
      const governorate = await this.prisma.governorate.findUnique({ where: { globalId: id } });
      if (!governorate) {
        throw new NotFoundError(`Governorate with id ${id} not found.`);
      }
      return governorate;
    } catch (error) {
      throw new DatabaseError('Error retrieving governorate.', error);
    }
  }

  async createGovernorate(name: string): Promise<Governorate> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;

      const existing = await this.prisma.governorate.findFirst({ where: { name } });
      if (existing) {
        throw new ValidationError(`هذي المحافظة ${name} موجودة بالفعل`);
      }

      return await this.prisma.governorate.create({
        data: {
          name,
          deleted: false,
          globalId,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A governorate with the name '${name}' already exists.`);
      } else if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new DatabaseError('Error creating new governorate.', error);
      }
    }
  }

  async updateGovernorate(id: string, data: { name: string }): Promise<Governorate> {
    try {
      const existing = await this.prisma.governorate.findUnique({ where: { globalId: id } });
      if (!existing) {
        throw new NotFoundError(`Governorate with id ${id} not found.`);
      }

      const duplicate = await this.prisma.governorate.findFirst({ where: { name: data.name } });
      if (duplicate && duplicate.globalId !== id) {
        throw new ValidationError(`هذي المحافظة ${data.name} موجودة بالفعل`);
      }

      return await this.prisma.governorate.update({
        where: { globalId: id },
        data: {
          ...data,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Error updating governorate.', error);
    }
  }

  async deleteGovernorate(id: string): Promise<Governorate> {
    try {
      const governorate = await this.prisma.governorate.findUnique({ where: { globalId: id } });
      if (!governorate) {
        throw new NotFoundError(`Governorate with id ${id} not found.`);
      }

      return await this.prisma.governorate.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      throw new DatabaseError('Error deleting governorate.', error);
    }
  }
}
