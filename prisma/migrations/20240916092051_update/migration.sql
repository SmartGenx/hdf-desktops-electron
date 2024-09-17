-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "phone" TEXT,
    "address" TEXT,
    "profileImage" TEXT,
    "resetToken" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "resetTokenExpiry" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "roleGlobalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accredited" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "squareGlobalId" TEXT,
    "treatmentSite" TEXT NOT NULL,
    "doctor" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "numberOfRfid" INTEGER NOT NULL,
    "formNumber" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "applicantGlobalId" TEXT NOT NULL,
    "pharmacyGlobalId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accredited_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "currentResidence" TEXT NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "directorateGlobalId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "accredited" BOOLEAN NOT NULL DEFAULT false,
    "categoryGlobalId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "prescriptionDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "attachedUrl" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "accreditedGlobalId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "attachmentFile" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "accreditedGlobalId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "SupportRatio" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Directorate" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "governorateGlobalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Directorate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiseasesApplicants" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "diseaseGlobalId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "applicantGlobalId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiseasesApplicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dismissal" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "dateToDay" TIMESTAMP(3) NOT NULL,
    "state" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "approvedAmount" DOUBLE PRECISION NOT NULL,
    "openDismissal" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "accreditedGlobalId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dismissal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Governorate" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Governorate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pharmacy" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDispenseDate" INTEGER NOT NULL,
    "endispenseDate" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "governorateGlobalId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pharmacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Square" (
    "id" SERIAL NOT NULL,
    "globalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Square_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_globalId_key" ON "User"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_globalId_key" ON "User"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_globalId_key" ON "Role"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_globalId_key" ON "Role"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Accredited_globalId_key" ON "Accredited"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Accredited_id_globalId_key" ON "Accredited"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_globalId_key" ON "Applicant"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_id_globalId_key" ON "Applicant"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_globalId_key" ON "Prescription"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_id_globalId_key" ON "Prescription"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_globalId_key" ON "Attachment"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_id_globalId_key" ON "Attachment"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_globalId_key" ON "Category"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Directorate_globalId_key" ON "Directorate"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Directorate_id_globalId_key" ON "Directorate"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_globalId_key" ON "Disease"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_id_globalId_key" ON "Disease"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "DiseasesApplicants_globalId_key" ON "DiseasesApplicants"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "DiseasesApplicants_id_globalId_key" ON "DiseasesApplicants"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Dismissal_globalId_key" ON "Dismissal"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Dismissal_id_globalId_key" ON "Dismissal"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Governorate_globalId_key" ON "Governorate"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Governorate_id_globalId_key" ON "Governorate"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_globalId_key" ON "Pharmacy"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_id_globalId_key" ON "Pharmacy"("id", "globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Square_globalId_key" ON "Square"("globalId");

-- CreateIndex
CREATE UNIQUE INDEX "Square_id_globalId_key" ON "Square"("id", "globalId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleGlobalId_fkey" FOREIGN KEY ("roleGlobalId") REFERENCES "Role"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accredited" ADD CONSTRAINT "Accredited_applicantGlobalId_fkey" FOREIGN KEY ("applicantGlobalId") REFERENCES "Applicant"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accredited" ADD CONSTRAINT "Accredited_squareGlobalId_fkey" FOREIGN KEY ("squareGlobalId") REFERENCES "Square"("globalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accredited" ADD CONSTRAINT "Accredited_pharmacyGlobalId_fkey" FOREIGN KEY ("pharmacyGlobalId") REFERENCES "Pharmacy"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_categoryGlobalId_fkey" FOREIGN KEY ("categoryGlobalId") REFERENCES "Category"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_directorateGlobalId_fkey" FOREIGN KEY ("directorateGlobalId") REFERENCES "Directorate"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_accreditedGlobalId_fkey" FOREIGN KEY ("accreditedGlobalId") REFERENCES "Accredited"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_accreditedGlobalId_fkey" FOREIGN KEY ("accreditedGlobalId") REFERENCES "Accredited"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Directorate" ADD CONSTRAINT "Directorate_governorateGlobalId_fkey" FOREIGN KEY ("governorateGlobalId") REFERENCES "Governorate"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseasesApplicants" ADD CONSTRAINT "DiseasesApplicants_applicantGlobalId_fkey" FOREIGN KEY ("applicantGlobalId") REFERENCES "Applicant"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseasesApplicants" ADD CONSTRAINT "DiseasesApplicants_diseaseGlobalId_fkey" FOREIGN KEY ("diseaseGlobalId") REFERENCES "Disease"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dismissal" ADD CONSTRAINT "Dismissal_accreditedGlobalId_fkey" FOREIGN KEY ("accreditedGlobalId") REFERENCES "Accredited"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pharmacy" ADD CONSTRAINT "Pharmacy_governorateGlobalId_fkey" FOREIGN KEY ("governorateGlobalId") REFERENCES "Governorate"("globalId") ON DELETE RESTRICT ON UPDATE CASCADE;
