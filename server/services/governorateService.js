const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');


class GovernorateService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Fetch all governorates from the database
  async getAllGovernorates() {
    try {
      return await this.prisma.governorate.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving governorates.', error);
    }
  }

  // Fetch a single governorate by its ID
  async getGovernorateById(id) {
    try {
      const governorate = await this.prisma.governorate.findUnique({
        where: { globalId: id },
      });

      if (!governorate) {
        throw new NotFoundError(`Governorate with id ${id} not found.`);
      }

      return governorate;
    } catch (error) {
      throw new DatabaseError('Error retrieving governorate.', error);
    }
  }

  // Create a new governorate
  async createGovernorate(name) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`; //remove name artib
      const existingGovernorate = await this.prisma.governorate.findFirst({
        where: { name: name },
      })
      if(existingGovernorate) {
        throw new ValidationError(`هذي المحافظة  ${name}  موجودة بالفعل `);
      }
      return await this.prisma.governorate.create({
        data: {
          name,
          deleted: false,
          globalId: globalId
        },
      });
    } catch (error) {

      if (error.code === 'P2002') {
        throw new ValidationError(`A governorate with the name '${name}' already exists.`);
      }
      else if (error instanceof ValidationError) {
        throw error
      }

       else {
        throw new DatabaseError('Error creating new governorate.', error);
      }
    }
  }

  // Update an existing governorate
  async updateGovernorate(id, data) {
    try {
      const existingGovernorate = await this.prisma.governorate.findUnique({ where: { globalId: id } });

      if (!existingGovernorate) {
        throw new NotFoundError(`Governorate with id ${id} not found.`);
      }
      const existingGovernorateName = await this.prisma.governorate.findFirst({ where: { name: data.name } })

      if (existingGovernorateName) {
        throw new ValidationError(`هذي المحافظة  ${name}  موجودة بالفعل `);
      }


      return await this.prisma.governorate.update({
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
      throw new DatabaseError('Error updating governorate.', error);
    }
  }

  // Delete a governorate by ID
  async deleteGovernorate(id) {
    try {
      const governorate = await this.prisma.governorate.findUnique({ where: { globalId: id } });

      if (!governorate) {
        throw new NotFoundError(`Governorate with id ${id} not found.`);
      }
      return await this.prisma.governorate.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });
      // Return the name of the deleted governorate

    } catch (error) {
      throw new DatabaseError('Error deleting governorate.', error);
    }
  }
}

module.exports = GovernorateService;
