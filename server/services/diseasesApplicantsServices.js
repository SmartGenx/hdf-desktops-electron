const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');
class DiseasesApplicantsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllDiseasesApplicants() {
    try {
      return await this.prisma.diseasesApplicants.findMany();
    } catch (error) {
      throw new DatabaseError('Error retrieving diseases applicants.', error);
    }
  }

  async getDiseasesApplicantsById(id) {
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

  async createDiseasesApplicants(diseaseId, applicantId) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
      return await this.prisma.diseasesApplicants.create({
        data: {
          diseaseId,
          deleted: false,
          applicantId,
          globalId: globalId
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError(`Disease Applicants relation already exists.`);
      } else {
        throw new DatabaseError('Error creating new diseases applicants.', error);
      }
    }
  }

  async updateDiseasesApplicants(id, diseaseId, applicantId) {
    // try {
      const existingDiseasesApplicants = await this.prisma.diseasesApplicants.findUnique({
        where: { globalId: id }
      });
      if (!existingDiseasesApplicants) {
        throw new NotFoundError(`Diseases Applicants with id ${id} not found.`);
      }

      return await this.prisma.diseasesApplicants.update({
        where: { globalId:id },
        data: {
          diseaseGlobalId:diseaseId,
          applicantGlobalId:applicantId,
          version: { increment: 1 }, // Increment version for conflict resolution

        },
      });
  }

  async deleteDiseasesApplicants(id) {
    try {
      const diseasesApplicants = await this.prisma.diseasesApplicants.findUnique({ where: { id } });

      if (!diseasesApplicants) {
        throw new NotFoundError(`Diseases Applicants with id ${id} not found.`);
      }

      const diseasesApplicant = await this.prisma.diseasesApplicants.update({
        where: { id },
        data: {
          deleted: true,
          version: { increment: 1 }, // Increment version for conflict resolution

        },
      });

      return diseasesApplicant;
    } catch (error) {
      throw new DatabaseError('Error deleting diseases applicants.', error);
    }
  }
}

module.exports = DiseasesApplicantsService;
