import { PrismaClient } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';

export default class StatisticsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Method to get all statistics for dismissals and pharmacies
  async getAllStatisticsDismissals(): Promise<{ totalDismissals: number; totalPharmacies: number }> {
    try {
      const dismissalCount = await this.prisma.dismissal.count();
      const pharmacyCount = await this.prisma.pharmacy.count();

      return {
        totalDismissals: dismissalCount,
        totalPharmacies: pharmacyCount
      };
    } catch (error) {
      console.error("Error in StatisticsService.getAllStatisticsDismissals:", error);
      throw new DatabaseError('Error retrieving statistics from the database.', error);
    }
  }

  async getStatisticsInitialization(): Promise<{
    diseaseCount: number;
    governorateCount: number;
    directorateCount: number;
    squareCount: number;
  }> {
    try {
      const diseaseCount = await this.prisma.disease.count({ where: { deleted: false } });
      const governorateCount = await this.prisma.governorate.count({ where: { deleted: false } });
      const directorateCount = await this.prisma.directorate.count({ where: { deleted: false } });
      const squareCount = await this.prisma.square.count({ where: { deleted: false } });

      return {
        diseaseCount,
        governorateCount,
        directorateCount,
        squareCount
      };
    } catch (error) {
      throw new DatabaseError('Error retrieving statistics from the database.', error);
    }
  }
}
