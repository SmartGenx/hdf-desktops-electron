// syncProcess.js

const { databaseService } = require('./database');

const synchronizeAllTables = async () => {
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
    'dismissal',
  ];

  for (const table of tables) {
    await databaseService.synchronizeTable(table);

    await databaseService.fetchUpdatesFromServer(table);
  }
};

const synchronizeBuckets = async () => {
  await databaseService.synchronizeS3ToLocal();
  await databaseService.synchronizeLocalToS3();
};

const synchronizeAll = async () => {
  try {
    // مزامنة جميع الجداول
    await synchronizeAllTables();

    // مزامنة البوكيت
    await synchronizeBuckets();
  } catch (error) {
    console.error('Error during synchronization:', error);
  }
};

// تشغيل المزامنة عند بدء العملية
synchronizeAll().catch(console.error);

// جدولة المزامنة لتعمل كل ساعة
setInterval(() => {
  synchronizeAll().catch(console.error);
}, 3600000); // كل ساعة
