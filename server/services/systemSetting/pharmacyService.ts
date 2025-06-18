import { PrismaClient, Pharmacy } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

interface PharmacyInput {
  name: string;
  governorateGlobalId: string;
  address?: string;
  phone?: string;
  startDispenseDate: number;
  endispenseDate: number;
}

export default class PharmacyService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllPharmacies(): Promise<Pharmacy[]> {
    try {
      return await this.prisma.pharmacy.findMany({
        where: { deleted: false },
        include: { Governorate: true }
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving pharmacies.', error);
    }
  }

  async getPharmacyById(id: string): Promise<Pharmacy> {
    try {
      const pharmacy = await this.prisma.pharmacy.findUnique({ where: { globalId: id } });
      if (!pharmacy) {
        throw new NotFoundError(`Pharmacy with id ${id} not found.`);
      }
      return pharmacy;
    } catch (error) {
      throw new DatabaseError('Error retrieving pharmacy.', error);
    }
  }

  async createPharmacy(data: PharmacyInput): Promise<Pharmacy> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;

      const existing = await this.prisma.pharmacy.findFirst({ where: { name: data.name } });
      if (existing) {
        throw new ValidationError(`هذة الصيدلية ${data.name} موجودة بالفعل`);
      }

      return await this.prisma.pharmacy.create({
        data: {
          name: data.name,
          globalId,
          location: data.address || '',
          governorateGlobalId: data.governorateGlobalId,
          startDispenseDate: data.startDispenseDate, 
          endispenseDate: data.endispenseDate  
        }
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError(`هذة الصيدلية ${data.name} موجودة بالفعل`);
      } else if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new DatabaseError('Error creating new pharmacy.', error);
      }
    }
  }

  async updatePharmacy(id: string, data: PharmacyInput): Promise<Pharmacy> {
    try {
      const existingPharmacy = await this.prisma.pharmacy.findUnique({ where: { globalId: id } });
      if (!existingPharmacy) {
        throw new NotFoundError(`Pharmacy with id ${id} not found.`);
      }

      const existingName = await this.prisma.pharmacy.findFirst({ where: { name: data.name } });
      if (existingName && existingName.globalId !== id) {
        throw new ValidationError(`هذة الصيدلية ${data.name} موجودة بالفعل`);
      }

      return await this.prisma.pharmacy.update({
        where: { globalId: id },
        data: {
          name: data.name,
          location: data.address || '',
          governorateGlobalId: data.governorateGlobalId,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Error updating pharmacy.', error);
    }
  }

  async deletePharmacy(id: string): Promise<string> {
    try {
      const pharmacy = await this.prisma.pharmacy.findUnique({ where: { globalId: id } });
      if (!pharmacy) {
        throw new NotFoundError(`Pharmacy with id ${id} not found.`);
      }

      await this.prisma.pharmacy.update({
        where: { globalId: id },
        data: { deleted: true, version: { increment: 1 } }
      });

      return pharmacy.name;
    } catch (error) {
      throw new DatabaseError('Error deleting pharmacy.', error);
    }
  }
}
