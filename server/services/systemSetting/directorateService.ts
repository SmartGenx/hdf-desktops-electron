import { PrismaClient, Directorate } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

interface DirectorateInput {
  name: string;
  governorateId: string; 
}

export default class DirectorateService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllDirectorates(): Promise<Directorate[]> {
    try {
      return await this.prisma.directorate.findMany({
        where: { deleted: false },
        include: { Governorate: true }
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving directorates.', error);
    }
  }

  async getDirectorateById(id: string): Promise<Directorate> {
    try {
      const directorate = await this.prisma.directorate.findUnique({ where: { globalId: id } });
      if (!directorate) {
        throw new NotFoundError(`Directorate with id ${id} not found.`);
      }
      return directorate;
    } catch (error) {
      throw new DatabaseError('Error retrieving directorate.', error);
    }
  }

  async createDirectorate(data: DirectorateInput): Promise<Directorate> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;

      const existing = await this.prisma.directorate.findFirst({ where: { name: data.name } });
      if (existing) {
        throw new ValidationError(`هذي المديرية ${data.name} موجودة بالفعل`);
      }

      return await this.prisma.directorate.create({
        data: {
          name: data.name,
          globalId,
          governorateGlobalId: data.governorateId // ✅ استخدام المفتاح الأجنبي الصحيح
        }
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A directorate with the name '${data.name}' already exists.`);
      } else if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new DatabaseError('Error creating new directorate.', error);
      }
    }
  }

  async updateDirectorate(id: string, data: DirectorateInput): Promise<Directorate> {
    try {
      const existingDirectorate = await this.prisma.directorate.findUnique({ where: { globalId: id } });
      if (!existingDirectorate) {
        throw new NotFoundError(`Directorate with id ${id} not found.`);
      }

      const existingName = await this.prisma.directorate.findFirst({ where: { name: data.name } });
      if (existingName && existingName.globalId !== id) {
        throw new ValidationError(`هذي المديرية ${data.name} موجودة بالفعل`);
      }

      return await this.prisma.directorate.update({
        where: { globalId: id },
        data: {
          name: data.name,
          governorateGlobalId: data.governorateId, // ✅ تحديث العلاقة
          version: { increment: 1 }
        }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Error updating directorate.', error);
    }
  }

  async deleteDirectorate(id: string): Promise<Directorate> {
    try {
      const directorate = await this.prisma.directorate.findUnique({ where: { globalId: id } });
      if (!directorate) {
        throw new NotFoundError(`Directorate with id ${id} not found.`);
      }

      return await this.prisma.directorate.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      throw new DatabaseError('Error deleting directorate.', error);
    }
  }
}
