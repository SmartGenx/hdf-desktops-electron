import { PrismaClient, Applicant } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { convertTopLevelStringBooleans } from '../../utilty/convertTopLevelStringBooleans';
import { convertStringNumbers } from '../../utilty/convertToInt';

export default class ApplicantService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllApplicants(dataFilter: any) {
    try {
      const { page, pageSize, include: rawInclude, orderBy, ...filters } = dataFilter;
      const include = rawInclude ? convertTopLevelStringBooleans(rawInclude) : {};
      const where = filters ? convertStringNumbers(filters) : {};

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const applicant = await this.prisma.applicant.findMany({
          where: { ...where, deleted: false, accredited: false },
          include,
          skip,
          take,
          orderBy
        });
        const total = await this.prisma.applicant.count({
          where: { ...where, deleted: false, accredited: false }
        });
        return { info: applicant, total, page, pageSize };
      }
      return await this.prisma.applicant.findMany({
        where: { ...where, deleted: false, accredited: false },
        include,
        orderBy
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving applicants.', error);
    }
  }

  async getApplicantById(id: string) {
    try {
      const applicant = await this.prisma.applicant.findUnique({
        where: { globalId: id },
        include: {
          category: true,
          directorate: true,
          diseasesApplicants: true,
        }
      });
      if (!applicant) throw new NotFoundError(`Applicant with id ${id} not found.`);
      return applicant;
    } catch (error) {
      throw new DatabaseError('Error retrieving applicant.', error);
    }
  }

  async createApplicant(ApplicantData: any) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
      const { diseaseGlobalId, ...rest } = ApplicantData;

      const applicant = await this.prisma.applicant.create({
        data: {
          ...rest,
          globalId
        }
      });

      if (applicant) {
        const diseaseRecordId = `${process.env.LOCAL_DB_ID}-${uuidv4()}-${Date.now()}`;
        const link = await this.prisma.diseasesApplicants.create({
          data: {
            diseaseGlobalId,
            applicantGlobalId: applicant.globalId,
            globalId: diseaseRecordId,
            deleted: false
          }
        });
        return link ? applicant : null;
      }
    } catch (error) {
      throw new DatabaseError('Error creating applicant.', error);
    }
  }

  async updateApplicant(id: string, ApplicantData: any) {
    try {
      const { diseaseGlobalId } = ApplicantData;
      delete ApplicantData.diseaseGlobalId;

      const existingApplicant = await this.prisma.applicant.findUnique({ where: { globalId: id } });
      if (!existingApplicant) throw new NotFoundError(`Applicant with id ${id} not found.`);

      const updated = await this.prisma.applicant.update({
        where: { globalId: id },
        data: { ...ApplicantData, version: { increment: 1 } }
      });

      const existingDisease = await this.prisma.diseasesApplicants.findFirst({
        where: {
          applicantGlobalId: existingApplicant.globalId,
          diseaseGlobalId
        }
      });

      if (!existingDisease) throw new NotFoundError('Disease record not found for this applicant.');

      await this.prisma.diseasesApplicants.update({
        where: { globalId: existingDisease.globalId },
        data: {
          diseaseGlobalId,
          applicantGlobalId: existingApplicant.globalId,
          version: { increment: 1 }
        }
      });

      return updated;
    } catch (error) {
      throw new DatabaseError('Error updating applicant.', error);
    }
  }

  async deleteApplicant(id: string) {
    try {
      const applicant = await this.prisma.applicant.findUnique({ where: { globalId: id } });
      if (!applicant) throw new NotFoundError(`Applicant with id ${id} not found.`);

      return await this.prisma.applicant.update({
        where: { globalId: id },
        data: { deleted: true, version: { increment: 1 } }
      });
    } catch (error) {
      throw new DatabaseError('Error deleting applicant.', error);
    }
  }
}
