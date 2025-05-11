// AccreditedService.ts
import { PrismaClient } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import {ValidationError} from '../../errors/ValidationError';
import {convertStringNumbers} from '../../utilty/convertToInt';
import {convertTopLevelStringBooleans} from '../../utilty/convertTopLevelStringBooleans';
import { v4 as uuidv4 } from 'uuid';

export default class AccreditedService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async searchAccreditations(dataFilter: any) {
    const getDateMonthsFromNow = (months: number) => {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + months);
      return currentDate;
    };
    const currentDate = getDateMonthsFromNow(0);

    try {
      const accreditations = await this.prisma.accredited.findMany({
        include: {
          applicant: {
            include: {
              diseasesApplicants: {
                include: {
                  Disease: true,
                },
              },
            },
          },
          square: true,
          dismissal: {
            orderBy: { id: 'desc' },
            take: 1,
          },
        },
      });

      for (const accredited of accreditations) {
        if (accredited.state === 'موقف') continue;

        const prescriptions = await this.prisma.prescription.findFirst({
          where: { accreditedGlobalId: accredited.globalId },
        });

        const dismissal = await this.prisma.dismissal.findFirst({
          where: { accreditedGlobalId: accredited.globalId },
          orderBy: { id: 'desc' },
        });

        const dismissalDate = dismissal?.dateToDay ? new Date(dismissal.dateToDay) : null;
        const renewalDate = prescriptions?.renewalDate ? new Date(prescriptions.renewalDate) : null;

        if (!renewalDate && !dismissalDate) continue;

        const threeMonthsFromRenewal = renewalDate ? new Date(renewalDate.setMonth(renewalDate.getMonth() + 3)) : null;
        const threeMonthsFromDismissal = dismissalDate ? new Date(dismissalDate.setMonth(dismissalDate.getMonth() + 3)) : null;

        let newState: string | undefined;

        if (renewalDate && threeMonthsFromRenewal && threeMonthsFromRenewal < currentDate) {
          newState = 'موقف';
        } else if (dismissalDate && threeMonthsFromDismissal && threeMonthsFromDismissal < currentDate) {
          newState = 'موقف';
        } else if (renewalDate && renewalDate < currentDate) {
          newState = 'منتهي';
        } else if (renewalDate && renewalDate >= currentDate) {
          newState = 'مستمر';
        }

        if (newState) {
          await this.prisma.accredited.update({
            where: { globalId: accredited.globalId },
            data: {
              state: newState,
              version: { increment: 1 },
            },
          });
        }
      }

      const { page, pageSize, include: inc, orderBy: ord, ...restFilters } = dataFilter;
      const include = inc ? convertTopLevelStringBooleans(inc) : {};
      const orderBy = ord || {};
      const filters = convertStringNumbers(restFilters);

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;

        const accredited = await this.prisma.accredited.findMany({
          where: { ...filters, deleted: false },
          include,
          skip,
          take,
          orderBy,
        });

        const total = await this.prisma.accredited.count({
          where: { ...filters, deleted: false },
        });

        return { info: accredited, total, page, pageSize };
      }

      return await this.prisma.accredited.findMany({
        where: { ...filters, deleted: false },
        include,
        orderBy,
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving accreditations.', error);
    }
  }

  // Add other methods in a similar style as needed
}
