/*
  Warnings:

  - The `formNumber` column on the `Accredited` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Accredited" DROP CONSTRAINT "Accredited_pharmacyGlobalId_fkey";

-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_categoryGlobalId_fkey";

-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_directorateGlobalId_fkey";

-- DropForeignKey
ALTER TABLE "Directorate" DROP CONSTRAINT "Directorate_governorateGlobalId_fkey";

-- DropForeignKey
ALTER TABLE "Pharmacy" DROP CONSTRAINT "Pharmacy_governorateGlobalId_fkey";

-- AlterTable
ALTER TABLE "Accredited" DROP COLUMN "formNumber",
ADD COLUMN     "formNumber" INTEGER;

-- AddForeignKey
ALTER TABLE "Accredited" ADD CONSTRAINT "Accredited_pharmacyGlobalId_fkey" FOREIGN KEY ("pharmacyGlobalId") REFERENCES "Pharmacy"("globalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_categoryGlobalId_fkey" FOREIGN KEY ("categoryGlobalId") REFERENCES "Category"("globalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_directorateGlobalId_fkey" FOREIGN KEY ("directorateGlobalId") REFERENCES "Directorate"("globalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directorate" ADD CONSTRAINT "Directorate_governorateGlobalId_fkey" FOREIGN KEY ("governorateGlobalId") REFERENCES "Governorate"("globalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pharmacy" ADD CONSTRAINT "Pharmacy_governorateGlobalId_fkey" FOREIGN KEY ("governorateGlobalId") REFERENCES "Governorate"("globalId") ON DELETE CASCADE ON UPDATE CASCADE;
