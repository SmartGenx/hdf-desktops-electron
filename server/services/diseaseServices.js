const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');
class DiseaseService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllDiseases() {
    try {
      return await this.prisma.disease.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving diseases.', error);
    }
  }

  async getDiseaseById(id) {
    try {
      const disease = await this.prisma.disease.findUnique({
        where: { globalId: id },
      });

      if (!disease) {
        throw new NotFoundError(`Disease with id ${id} not found.`);
      }

      return disease;
    } catch (error) {
      throw new DatabaseError('Error retrieving disease.', error);
    }
  }

  async createDisease(name, description) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`;
      return await this.prisma.disease.create({
        data: {
          name,
          deleted: false,
          description,
          globalId: globalId
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A disease with the name '${name}' already exists.`);
      } else {
        throw new DatabaseError('Error creating new disease.', error);
      }
    }
  }

  async updateDisease(id, data) {
    try {
      const existingDisease = await this.prisma.disease.findUnique({ where: { globalId: id } });

      if (!existingDisease) {
        throw new NotFoundError(`Disease with id ${id} not found.`);
      }

      return await this.prisma.disease.update({
        where: { globalId: id },
        data: {
          ...data,
          version: { increment: 1 }, // Increment version for conflict resolution
        },
      });
    } catch (error) {
      throw new DatabaseError('Error updating disease.', error);
    }
  }

  async deleteDisease(id) {
    try {
      const disease = await this.prisma.disease.findUnique({ where: { globalId: id } });

      if (!disease) {
        throw new NotFoundError(`Disease with id ${id} not found.`);
      }
      const diseaseName = disease.name;
      await this.prisma.disease.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 }, // Increment version for conflict resolution

        },
      });

      return diseaseName;
    } catch (error) {
      throw new DatabaseError('Error deleting disease.', error);
    }
  }
}

module.exports = DiseaseService;
