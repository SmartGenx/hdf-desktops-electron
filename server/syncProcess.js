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
    try {
      const recordsProcessed = await databaseService.synchronizeTable(table);
      const updatesApplied = await databaseService.fetchUpdatesFromServer(table);

      if ((recordsProcessed || updatesApplied)) {
        await databaseService.updateLastSyncedAt(table);
        console.log(`تم تحديث وقت آخر مزامنة للجدول ${table}`);
      } else {
        console.log(`لم تتم معالجة أي سجلات للجدول ${table}، لذلك لن يتم تحديث وقت آخر مزامنة.`);
      }
    } catch (error) {
      console.error(`فشل المزامنة للجدول ${table}:`, error);
    }
  }
};


const synchronizeBuckets = async () => {
  await databaseService.synchronizeS3ToLocal();
  await databaseService.synchronizeLocalToS3();
};

const synchronizeAll = async () => {
  try {
    await synchronizeAllTables();

    await synchronizeBuckets();
  } catch (error) {
    console.error('Error during synchronization:', error);
  }
};

module.exports = {
  synchronizeAll
};
