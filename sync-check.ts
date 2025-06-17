import dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'

const localPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

const cloudPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.CLOUD_DATABASE_URL }
  }
});

const tables = [
  'role',
  'user',
  'category',
  'governorate',
  'directorate',
  'pharmacy',
  'square',
  'disease',
  'applicant',
  'accredited',
  'diseasesApplicants',
  'prescription',
  'attachment',
  'dismissal'
];

async function compareSyncStatus() {
  for (const table of tables) {
    const localRecords = await (localPrisma as any)[table].findMany();
    const cloudRecords = await (cloudPrisma as any)[table].findMany();

    const onlyInLocal = localRecords.filter(local =>
      !cloudRecords.some(cloud => cloud.globalId === local.globalId)
    );

    const onlyInCloud = cloudRecords.filter(cloud =>
      !localRecords.some(local => local.globalId === cloud.globalId)
    );

    console.log(`\n🔍 Table: ${table}`);
    console.log(`  🧪 Local count: ${localRecords.length}`);
    console.log(`  ☁️  Cloud count: ${cloudRecords.length}`);
    console.log(`  🚫 Not in cloud: ${onlyInLocal.length}`);
    console.log(`  ❗ Not in local: ${onlyInCloud.length}`);
  }

  await localPrisma.$disconnect();
  await cloudPrisma.$disconnect();
}

compareSyncStatus().catch(console.error);
