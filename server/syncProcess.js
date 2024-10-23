// syncProcess.js

const { databaseService } = require('./database');

const synchronizeAllTables = async () => {
  const tables = [
    'Role',
    'User',
    'Category',
    'Governorate',
    'Directorate',
    'Square',
    'Disease',
    'Applicant',
    'Pharmacy',
    'Accredited',
    'DiseasesApplicants',
    'Prescription',
    'Attachment',
    'Dismissal',
  ];

  for (const table of tables) {
    await databaseService.synchronizeTable(table);
    await databaseService.fetchUpdatesFromServer(table);
  }
};

// تشغيل المزامنة عند بدء العملية
synchronizeAllTables().catch(console.error);

// جدولة المزامنة لتعمل كل ساعة
setInterval(() => {
  synchronizeAllTables().catch(console.error);
}, 3600000); // كل ساعة
