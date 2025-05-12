import { PrismaClient } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import {convertTopLevelStringBooleans} from '../../utilty/convertTopLevelStringBooleans';

function getYearAndMonth(dateString: string) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  return { year, month };
}

export default class DismissalService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllDismissals(dataFilter: any) {
    try {
      const { page, pageSize, include: rawInclude, orderBy, ...filters } = dataFilter;

      const include = rawInclude ? convertTopLevelStringBooleans(rawInclude) : {};

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;

        const dismissal = await this.prisma.dismissal.findMany({
          where: { ...filters, deleted: false },
          include,
          skip,
          take,
          orderBy
        });

        const total = await this.prisma.dismissal.count({ where: filters });

        return { info: dismissal, total, page, pageSize };
      }

      return await this.prisma.dismissal.findMany({ where: filters, include, orderBy });
    } catch (error) {
      throw new DatabaseError('Error retrieving dismissals.', error);
    }
  }

  async getDismissalById(id: string) {
    try {
      const dismissal = await this.prisma.dismissal.findUnique({ where: { globalId: id } });
      if (!dismissal) throw new NotFoundError(`Dismissal with id ${id} not found.`);
      return dismissal;
    } catch (error) {
      throw new DatabaseError('Error retrieving dismissal.', error);
    }
  }

  async createDismissal(dismissalData: any) {
    const { pharmacyGlobalId, ...data } = dismissalData;
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
    const currentDate = new Date();
    const currentMonthStr = String(currentDate.getMonth() + 1);
    const currentYearStr = String(currentDate.getFullYear());

    const isDateBetween = (target: number, start: number, end: number) => target >= start && target <= end;

    try {
      const accredited = await this.prisma.accredited.findFirst({ where: { globalId: data.accreditedGlobalId, state: 'موقف' } });
      if (accredited) return { message: 'هذا المريض موقف عليك مراجعة الادارة' };

      const exists = await this.prisma.dismissal.findFirst({
        where: {
          accreditedGlobalId: data.accreditedGlobalId,
          month: currentMonthStr,
          year: currentYearStr
        }
      });
      if (exists) return { message: 'تم الصرف مسبقا' };

      const pharmacy = await this.prisma.pharmacy.findUnique({ where: { globalId: pharmacyGlobalId } });
      if (!pharmacy) throw new NotFoundError(`Pharmacy with id ${pharmacyGlobalId} not found.`);

      const today = new Date().getDate();
      if (!isDateBetween(today, pharmacy.startDispenseDate, pharmacy.endispenseDate)) {
        return { message: 'انتهاء وقت الصرف في هذه الصيدلية' };
      }

      return await this.prisma.dismissal.create({
        data: {
          ...data,
          month: currentMonthStr,
          year: currentYearStr,
          dateToDay: currentDate,
          openDismissal: false,
          globalId
        }
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error creating new dismissal.', error);
    }
  }

  async checkDismissal(data: any) {
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
    const currentDate = new Date();
    const currentMonthStr = String(currentDate.getMonth() + 1);
    const currentYearStr = String(currentDate.getFullYear());

    const isDateBetween = (target: number, start: number, end: number) => target >= start && target <= end;

    try {
      const accredited = await this.prisma.accredited.findFirst({ where: { numberOfRfid: data.numberOfRfid } });
      if (!accredited) throw new NotFoundError('Accredited does not exist.');
      if (accredited.state === 'موقف') return { message: 'هذا المريض موقف عليك مراجعة الادارة' };

      const exists = await this.prisma.dismissal.findFirst({
        where: {
          accreditedGlobalId: accredited.globalId,
          month: currentMonthStr,
          year: currentYearStr
        },
        orderBy: { id: 'desc' }
      });
      if (exists) return { message: 'تم الصرف مسبقا' };

      const pharmacy = await this.prisma.pharmacy.findFirst({ where: { globalId: accredited.pharmacyGlobalId } });
      if (!pharmacy) throw new NotFoundError(`Pharmacy with id ${accredited.pharmacyGlobalId} not found.`);

      const today = new Date().getDate();
      if (!isDateBetween(today, pharmacy.startDispenseDate, pharmacy.endispenseDate)) {
        return { message: 'انتهاء وقت الصرف في هذه الصيدلية' };
      }
      return null;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Error checking dismissal.', error);
    }
  }

  async updateDismissal(id: string, dismissalData: any) {
    try {
      const existing = await this.prisma.dismissal.findUnique({ where: { globalId: id } });
      if (!existing) throw new NotFoundError(`Dismissal with id ${id} not found.`);

      const totalAmount = dismissalData.totalAmount ?? existing.totalAmount;
      const amountPaid = dismissalData.amountPaid ?? existing.amountPaid;
      const approvedAmount = dismissalData.approvedAmount ?? existing.approvedAmount;

      return await this.prisma.dismissal.update({
        where: { globalId: id },
        data: {
          ...dismissalData,
          totalAmount: +totalAmount,
          amountPaid: +amountPaid,
          approvedAmount: +approvedAmount,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      throw new DatabaseError('Error updating dismissal.', error);
    }
  }

  async deleteDismissal(id: string) {
    try {
      const dismissal = await this.prisma.dismissal.findUnique({ where: { globalId: id } });
      if (!dismissal) throw new NotFoundError(`Dismissal with id ${id} not found.`);

      return await this.prisma.dismissal.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      throw new DatabaseError('Error deleting dismissal.', error);
    }
  }
}
