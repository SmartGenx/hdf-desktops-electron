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
        console.log(`The last synchronization time for table ${table} was successfully updated.`);

      } else {
        console.log(`No records were processed for table ${table}, so the last synchronization time will not be updated.`);

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
