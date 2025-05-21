import { PrismaClient } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { convertStringNumbers } from '../../utilty/convertToInt';
import { convertTopLevelStringBooleans } from '../../utilty/convertTopLevelStringBooleans';

export default class PrescriptionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllPrescriptions(dataFilter: any) {
    try {
      const page = dataFilter?.page;
      const pageSize = dataFilter?.pageSize;
      delete dataFilter?.page;
      delete dataFilter?.pageSize;

      let include = dataFilter?.include;
      let orderBy = dataFilter?.orderBy;
      delete dataFilter?.include;
      delete dataFilter?.orderBy;

      include = include ? convertTopLevelStringBooleans(include) : {};
      dataFilter = dataFilter ? convertStringNumbers(dataFilter) : {};

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const prescriptions = await this.prisma.prescription.findMany({
          where: dataFilter,
          include,
          skip,
          take,
          orderBy
        });
        const total = await this.prisma.prescription.count({ where: dataFilter });
        return { info: prescriptions, total, page, pageSize };
      }

      return await this.prisma.prescription.findMany({
        where: dataFilter,
        include,
        orderBy
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving prescriptions.', error);
    }
  }

  async getPrescriptionById(id: string) {
    try {
      const prescription = await this.prisma.prescription.findFirst({
        where: { accreditedGlobalId: id }
      });

      if (!prescription) {
        throw new NotFoundError(`Prescription with id ${id} not found.`);
      }

      return prescription;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error retrieving prescription.', error);
    }
  }

  async createPrescription(prescriptionData: any, filePath: string) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}${uniqueId}-${timestamp}`;

      const { prescriptionDate, accreditedGlobalId } = prescriptionData;
      const renewalDate = new Date(prescriptionDate);
      renewalDate.setMonth(renewalDate.getMonth() + 6);

      return await this.prisma.prescription.create({
        data: {
          ...prescriptionData,
          renewalDate,
          attachedUrl: filePath,
          accreditedGlobalId,
          globalId
        }
      });
    } catch (error) {
      throw new DatabaseError('Error creating new prescription.', error);
    }
  }

  async updatePrescription(id: string, prescriptionData: any) {
    try {
      const existingPrescription = await this.prisma.prescription.findUnique({
        where: { globalId: id }
      });

      if (!existingPrescription) {
        throw new NotFoundError(`Prescription with id ${id} not found.`);
      }

      return await this.prisma.prescription.update({
        where: { globalId: id },
        data: {
          ...prescriptionData,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      throw new DatabaseError('Error updating prescription.', error);
    }
  }

  async deletePrescription(id: string) {
    try {
      const prescription = await this.prisma.prescription.findUnique({
        where: { globalId: id }
      });

      if (!prescription) {
        throw new NotFoundError(`Prescription with id ${id} not found.`);
      }

      return await this.prisma.prescription.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      throw new DatabaseError('Error deleting prescription.', error);
    }
  }
}
