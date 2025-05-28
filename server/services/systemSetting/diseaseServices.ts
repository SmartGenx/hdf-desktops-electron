import { PrismaClient, Disease } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

interface DiseaseInput {
  name: string;
  description: string;
}

export default class DiseaseService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllDiseases(): Promise<Disease[]> {
    try {
      return await this.prisma.disease.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving diseases.', error);
    }
  }

  async getDiseaseById(id: string): Promise<Disease> {
    try {
      const disease = await this.prisma.disease.findUnique({ where: { globalId: id } });
      if (!disease) {
        throw new NotFoundError(`Disease with id ${id} not found.`);
      }
      return disease;
    } catch (error) {
      throw new DatabaseError('Error retrieving disease.', error);
    }
  }

  async createDisease(name: string, description: string): Promise<Disease> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`;

      const existing = await this.prisma.disease.findFirst({ where: { name } });
      if (existing) {
        throw new ValidationError(`هذا المرض  ${name}  موجود بالفعل`);
      }

      return await this.prisma.disease.create({
        data: {
          name,
          description,
          deleted: false,
          globalId
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError(`هذا المرض  ${name}  موجود بالفعل`);
      } else if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new DatabaseError('Error creating new disease.', error);
      }
    }
  }

  async updateDisease(id: string, data: Partial<DiseaseInput>): Promise<Disease> {
    try {
      const existing = await this.prisma.disease.findUnique({ where: { globalId: id } });
      if (!existing) {
        throw new NotFoundError(`Disease with id ${id} not found.`);
      }

      const sameName = await this.prisma.disease.findFirst({ where: { name: data.name } });
      if (sameName && sameName.globalId !== id) {
        throw new ValidationError(`هذا المرض  ${name}  موجود بالفعل`);
      }

      return await this.prisma.disease.update({
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
      throw new DatabaseError('Error updating disease.', error);
    }
  }

  async deleteDisease(id: string): Promise<string> {
    try {
      const disease = await this.prisma.disease.findUnique({ where: { globalId: id } });
      if (!disease) {
        throw new NotFoundError(`Disease with id ${id} not found.`);
      }

      await this.prisma.disease.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });

      return disease.name;
    } catch (error) {
      throw new DatabaseError('Error deleting disease.', error);
    }
  }
}
