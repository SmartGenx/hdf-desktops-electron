-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "restToken" TIMESTAMP(3),
    "phone" TEXT,
    "image" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Postion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Postion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentOffice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "postionId" INTEGER NOT NULL,
    "governmentOfficeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "invitationType" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "state" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueDetails" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "detailsDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "judgment" TEXT NOT NULL,
    "refrance" TEXT NOT NULL,
    "Resumed" BOOLEAN NOT NULL,

    CONSTRAINT "IssueDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "refrance" TEXT NOT NULL,
    "governmentOfficeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "officeOpinian" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" SERIAL NOT NULL,
    "decisionName" TEXT NOT NULL,
    "refrance" TEXT NOT NULL,
    "governmentOfficeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "decisionSource" TEXT NOT NULL,
    "nameSource" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "attachmentPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generalization" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "refrance" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentPath" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "defaultDay" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaveallocation" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "leavetypeId" INTEGER NOT NULL,
    "remaingDay" INTEGER NOT NULL,
    "leaveYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Leaveallocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "file" TEXT NOT NULL,
    "emploteeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employ" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "education" TEXT NOT NULL,
    "megor" INTEGER NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "idtype" INTEGER NOT NULL,
    "idNumber" TEXT NOT NULL,
    "issuerDate" TIMESTAMP(3) NOT NULL,
    "issuerPlace" TEXT NOT NULL,
    "empLeaved" TEXT NOT NULL,
    "empDgree" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "firstEmployment" TEXT NOT NULL,
    "employmentDate" TIMESTAMP(3) NOT NULL,
    "currentUnit" INTEGER NOT NULL,
    "currentEmploymentDate" TIMESTAMP(3) NOT NULL,
    "legalStatus" INTEGER NOT NULL,
    "employeeStatus" INTEGER NOT NULL,
    "detailsDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Employ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaveDetails" (
    "id" SERIAL NOT NULL,
    "employeeeId" INTEGER NOT NULL,
    "leaveTypeId" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "leaveNote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "leaveDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookOrder" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sellingDate" TIMESTAMP(3) NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BookOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenseType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fees" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "licenseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "license" (
    "id" SERIAL NOT NULL,
    "licenseTypeId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseYear" INTEGER NOT NULL,
    "compnayPorpose" TEXT NOT NULL,
    "compnayLocation" TEXT NOT NULL,
    "compnayCapital" DOUBLE PRECISION NOT NULL,
    "compnayManger" TEXT NOT NULL,
    "referenceNum" TEXT NOT NULL,
    "referenceDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "license_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_postionId_fkey" FOREIGN KEY ("postionId") REFERENCES "Postion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_governmentOfficeId_fkey" FOREIGN KEY ("governmentOfficeId") REFERENCES "GovernmentOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueDetails" ADD CONSTRAINT "IssueDetails_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_governmentOfficeId_fkey" FOREIGN KEY ("governmentOfficeId") REFERENCES "GovernmentOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_governmentOfficeId_fkey" FOREIGN KEY ("governmentOfficeId") REFERENCES "GovernmentOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaveallocation" ADD CONSTRAINT "Leaveallocation_leavetypeId_fkey" FOREIGN KEY ("leavetypeId") REFERENCES "LeaveType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaveallocation" ADD CONSTRAINT "Leaveallocation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_emploteeId_fkey" FOREIGN KEY ("emploteeId") REFERENCES "Employ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaveDetails" ADD CONSTRAINT "leaveDetails_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaveDetails" ADD CONSTRAINT "leaveDetails_employeeeId_fkey" FOREIGN KEY ("employeeeId") REFERENCES "Employ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOrder" ADD CONSTRAINT "BookOrder_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOrder" ADD CONSTRAINT "BookOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "license_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "licenseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "license_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
