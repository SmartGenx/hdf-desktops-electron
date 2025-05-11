import { PrismaClient } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { convertTopLevelStringBooleans } from '../../utilty/convertTopLevelStringBooleans';
import { convertStringNumbers } from '../../utilty/convertToInt';

export default class AttachmentService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllAttachments(dataFilter: any) {
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
        const attachments = await this.prisma.attachment.findMany({
          where: dataFilter,
          include,
          skip,
          take,
          orderBy,
        });

        const total = await this.prisma.attachment.count({
          where: dataFilter,
        });

        return {
          info: attachments,
          total,
          page,
          pageSize,
        };
      }

      return await this.prisma.attachment.findMany({
        where: dataFilter,
        include,
        orderBy,
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving attachments.', error);
    }
  }

  async getAttachmentById(id: string) {
    try {
      const attachment = await this.prisma.attachment.findUnique({
        where: { globalId: id },
      });

      if (!attachment) {
        throw new NotFoundError(`Attachment with id ${id} not found.`);
      }

      return attachment;
    } catch (error) {
      throw new DatabaseError('Error retrieving attachment.', error);
    }
  }

  async getAttachmentByAccreditedId(id: string) {
    try {
      const attachment = await this.prisma.attachment.findFirst({
        where: { accreditedGlobalId: id },
      });

      if (!attachment) {
        throw new NotFoundError(`Attachment with accredited id ${id} not found.`);
      }

      return attachment;
    } catch (error) {
      throw new DatabaseError('Error retrieving attachment.', error);
    }
  }

  async createAttachment(attachmentData: { type: string; accreditedGlobalId: string }, filePath: string) {
    try {
      const { type, accreditedGlobalId } = attachmentData;
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;

      return await this.prisma.attachment.create({
        data: {
          type,
          accreditedGlobalId,
          attachmentFile: filePath,
          globalId,
        },
      });
    } catch (error) {
      throw new DatabaseError('Error creating new attachment.', error);
    }
  }

  async updateAttachment(id: string, attachmentData: any) {
    try {
      return await this.prisma.attachment.update({
        where: { globalId: id },
        data: {
          ...attachmentData,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      throw new DatabaseError('Error updating attachment.', error);
    }
  }

  async deleteAttachment(id: string) {
    try {
      return await this.prisma.attachment.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      throw new DatabaseError('Error deleting attachment.', error);
    }
  }
}
