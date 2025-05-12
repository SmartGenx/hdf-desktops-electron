const DatabaseError = require('../../errors/DatabaseError');
const NotFoundError = require('../../errors/NotFoundError');
const ValidationError = require('../../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');



class DirectorateService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Fetch all directorates from the database
  async getAllDirectorates() {
    try {
      return await this.prisma.Directorate.findMany({ where: { deleted: false },include: { Governorate: true } });
    } catch (error) {
      throw new DatabaseError('Error retrieving directorates.', error);
    }
  }

  // Fetch a single directorate by its ID
  async getDirectorateById(id) {
    try {
      const directorate = await this.prisma.Directorate.findUnique({
        where: { globalId: id },
      });

      if (!directorate) {
        throw new NotFoundError(`Directorate with id ${id} not found.`);
      }

      return directorate;
    } catch (error) {
      throw new DatabaseError('Error retrieving directorate.', error);
    }
  }

  // Create a new directorate
  async createDirectorate(data) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`; //remove name artib
      const existingDirectorate = await this.prisma.Directorate.findFirst({
        where: { name: data.name },
      })
      if(existingDirectorate) {
        throw new ValidationError(`هذي المديرية  ${data.name}  موجودة بالفعل `);
      }
      return await this.prisma.Directorate.create({
        data: { ...data, globalId: globalId },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A directorate with the name '${data.name}' already exists.`);
      }
      else if (error instanceof ValidationError) {
        throw error
      }
      else {
        throw new DatabaseError('Error creating new directorate.', error);
      }
    }
  }

  // Update an existing directorate
  async updateDirectorate(id, data) {
    try {
      const existingDirectorate = await this.prisma.Directorate.findUnique({ where: { globalId: id } });
      if (!existingDirectorate) {
        throw new NotFoundError(`Directorate with id ${id} not found.`);
      }

      const existingDirectorateName = await this.prisma.Directorate.findFirst({ where: { name: data.name } })

      if (existingDirectorateName) {
        throw new ValidationError(`هذي المديرية   ${data.name}  موجودة بالفعل `);
      }

      return await this.prisma.Directorate.update({
        where: { globalId: id },
        data: {
          ...data,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      if( error instanceof ValidationError) {
        throw error
      }
      else if( error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating directorate.', error);
    }
  }

  // Delete a directorate by ID
  async deleteDirectorate(id) {
    try {
      const directorate = await this.prisma.Directorate.findUnique({ where: { globalId: id } });
      if (!directorate) {
        throw new NotFoundError(`Directorate with id ${id} not found.`);
      }
      // Save the name for the response before deletion
      return await this.prisma.Directorate.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });
      // Return the name of the deleted directorate

    } catch (error) {
      throw new DatabaseError('Error deleting directorate.', error);
    }
  }
}

module.exports = DirectorateService;
