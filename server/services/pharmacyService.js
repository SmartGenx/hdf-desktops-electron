const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');

class PharmacyService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllPharmacies() {
    try {
      return await this.prisma.pharmacy.findMany({ where: { deleted: false },include: {Governorate: true}} );
    } catch (error) {
      throw new DatabaseError('Error retrieving pharmacies.', error);
    }
  }

  async getPharmacyById(id) {
    try {
      const pharmacy = await this.prisma.pharmacy.findUnique({
        where: { globalId: id },
      });

      if (!pharmacy) {
        throw new NotFoundError(`Pharmacy with id ${id} not found.`);
      }

      return pharmacy;
    } catch (error) {
      throw new DatabaseError('Error retrieving pharmacy.', error);
    }
  }

  async createPharmacy(PharmacyData) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
      const existingPharmacy = await this.prisma.pharmacy.findFirst({
        where: { name: PharmacyData.name },
      })
      if(existingPharmacy) {
        throw new ValidationError(`هذي الصيدلة  ${PharmacyData.name} موجودة بالفعل `);
      }
      return await this.prisma.pharmacy.create({
        data: {
          ...PharmacyData, // Spread the PharmacyData object to map its properties to the database fields
          globalId, // Shorthand for globalId: globalId
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A pharmacy with the given unique constraint already exists.`);
      }
      else if (error instanceof ValidationError) {
        throw error
      }
      else {
        // It's often helpful to log the error for debugging purposes
        console.error('Error creating new pharmacy:', error);
        throw new DatabaseError('Error creating new pharmacy.', error);
      }
    }
  }

  async updatePharmacy(id, data) {
    try {
      const existingPharmacy = await this.prisma.pharmacy.findUnique({ where: { globalId: id } });

      if (!existingPharmacy) {
        throw new NotFoundError(`Pharmacy with id ${id} not found.`);
      }

      const existingPharmacyName = await this.prisma.pharmacy.findFirst({ where: { name: data.name } })

      if (!existingPharmacyName) {
        return await this.prisma.pharmacy.update({
          where: { globalId: id },
          data: {
            ...data,
            version: { increment: 1 }, // Increment version for conflict resolution
          },
        });
      }
      if (existingPharmacyName.globalId !== existingPharmacy.globalId) {
        throw new ValidationError(`هذي الصيدلة  ${data.name}  موجودة بالفعل `)
      }

      return await this.prisma.pharmacy.update({
        where: { globalId: id },
        data: {
          ...data,
          version: { increment: 1 }, // Increment version for conflict resolution
        },
      });
    } catch (error) {
      if( error instanceof ValidationError) {
        throw error
      }
      else if( error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating pharmacy.', error);
    }
  }

  async deletePharmacy(id) {
    try {
      const pharmacy = await this.prisma.pharmacy.findUnique({ where: { globalId: id } });
      if (!pharmacy) {
        throw new NotFoundError(`Pharmacy with id ${id} not found.`);
      }
      const pharmacyName = pharmacy.name;
      await this.prisma.pharmacy.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 }, // Increment version for conflict resolution
        },
      });
      return pharmacyName;
    } catch (error) {
      throw new DatabaseError('Error deleting pharmacy.', error);
    }
  }
}

module.exports = PharmacyService;
