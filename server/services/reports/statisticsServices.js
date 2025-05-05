const DatabaseError = require('../../errors/DatabaseError');
const { v4: uuidv4 } = require('uuid');

class StatisticsServices {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Method to get all statistics for dismissals and pharmacies
  async getAllStatisticsDismissals() {
    try {
      // Using proper variable declaration with const
      const dismissalCount = await this.prisma.dismissal.count();
      const pharmacyCount = await this.prisma.pharmacy.count();

      // Returning object with more descriptive property names
      return {
        totalDismissals: dismissalCount,
        totalPharmacies: pharmacyCount
      };

    } catch (error) {
      // Logging the actual error and throwing a more specific error message
      console.error("Error in StatisticsServices.getAllStatisticsDismissals:", error);
      throw new DatabaseError('Error retrieving statistics from the database.', error);
    }
  }
  async getStatisticsInitialization() {
    try {
      const diseaseCount = await this.prisma.disease.count({ where: { deleted: false } });
      const GovernorateCount = await this.prisma.governorate.count({ where: { deleted: false } });
      const directoratecount = await this.prisma.directorate.count({ where: { deleted: false } });
      const squareCount = await this.prisma.square.count({ where: { deleted: false } });
  
      return {
        diseaseCount,
        GovernorateCount,
        directoratecount,
        squareCount,
      };
    } catch (error) {
      throw new DatabaseError('Error retrieving statistics from the database.', error);
    }
  }
  
  
}

module.exports = StatisticsServices;
