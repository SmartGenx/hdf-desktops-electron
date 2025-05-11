import { PrismaClient } from '@prisma/client';
import DatabaseError from '../../../errors/DatabaseError';
import NotFoundError from '../../../errors/NotFoundError';
import {ValidationError} from '../../../errors/ValidationError';
import { v4 as uuidv4 } from 'uuid';

export default class DiseasesApplicantsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllDiseasesApplicants() {
    try {
      return await this.prisma.diseasesApplicants.findMany();
    } catch (error) {
      throw new DatabaseError('Error retrieving diseases applicants.', error);
    }
  }

  async getDiseasesApplicantsById(id: number) {
    try {
      const diseasesApplicants = await this.prisma.diseasesApplicants.findUnique({
        where: { id },
      });

      if (!diseasesApplicants) {
        throw new NotFoundError(`Diseases Applicants with id ${id} not found.`);
      }

      return diseasesApplicants;
    } catch (error) {
      throw new DatabaseError('Error retrieving diseases applicants.', error);
    }
  }

  async createDiseasesApplicants(diseaseGlobalId: string, applicantGlobalId: string) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
      return await this.prisma.diseasesApplicants.create({
        data: {
          diseaseGlobalId,
          applicantGlobalId,
          globalId,
          deleted: false,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError('Disease Applicants relation already exists.');
      }
      throw new DatabaseError('Error creating new diseases applicants.', error);
    }
  }

  async updateDiseasesApplicants(id: string, diseaseGlobalId: string, applicantGlobalId: string) {
    const existingDiseasesApplicants = await this.prisma.diseasesApplicants.findUnique({
      where: { globalId: id },
    });

    if (!existingDiseasesApplicants) {
      throw new NotFoundError(`Diseases Applicants with id ${id} not found.`);
    }

    return await this.prisma.diseasesApplicants.update({
      where: { globalId: id },
      data: {
        diseaseGlobalId,
        applicantGlobalId,
        version: { increment: 1 },
      },
    });
  }

  async deleteDiseasesApplicants(id: number) {
    try {
      const diseasesApplicants = await this.prisma.diseasesApplicants.findUnique({
        where: { id },
      });

      if (!diseasesApplicants) {
        throw new NotFoundError(`Diseases Applicants with id ${id} not found.`);
      }

      return await this.prisma.diseasesApplicants.update({
        where: { id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      throw new DatabaseError('Error deleting diseases applicants.', error);
    }
  }
}
