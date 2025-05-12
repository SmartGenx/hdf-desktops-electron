import { PrismaClient } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';

import { v4 as uuidv4 } from 'uuid';
import { convertTopLevelStringBooleans } from '../../utilty/convertTopLevelStringBooleans';
import { convertStringNumbers } from '../../utilty/convertToInt';

export default class BackupService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getBackup(dataFilter: any) {
    try {
      const page = dataFilter?.page;
      const pageSize = dataFilter?.pageSize;
      delete dataFilter?.page;
      delete dataFilter?.pageSize;

      let include = dataFilter?.include;
      let orderBy = dataFilter?.orderBy;
      delete dataFilter?.include;
      delete dataFilter?.orderBy;

      if (include) {
        include = convertTopLevelStringBooleans(include);
      } else {
        include = {};
      }

      if (dataFilter) {
        dataFilter = convertStringNumbers(dataFilter);
      } else {
        dataFilter = {};
      }

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const records = await this.prisma.backUp.findMany({
          where: { ...dataFilter },
          skip,
          take,
          orderBy,
        });
        const total = await this.prisma.backUp.count({
          where: { ...dataFilter },
        });
        return {
          info: records,
          total,
          page,
          pageSize,
        };
      }

      return await this.prisma.backUp.findMany({
        where: { ...dataFilter },
        orderBy,
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving backup records.', error);
    }
  }

  async createBackup(path: string, userName: string) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;

      return await this.prisma.backUp.create({
        data: {
          path,
          userName,
          globalId,
        },
      });
    } catch (error) {
      throw new DatabaseError('Error creating backup record.', error);
    }
  }
}
