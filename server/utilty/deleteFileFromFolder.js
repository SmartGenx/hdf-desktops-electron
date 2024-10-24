// إضافة الدالة في ملف مستقل، مثل: deleteFile.js
const fs = require('fs').promises;
const path = require('path');

async function deleteFileFromFolder(folderPath, fileName) {
  try {
    const filePath = path.join(folderPath, fileName);

    // تحقق مما إذا كان الملف موجودًا
    const isFileExist = await fs.access(filePath).then(() => true).catch(() => false);

    if (isFileExist) {
      await fs.unlink(filePath);
      console.log(`File "${fileName}" deleted successfully from folder.`);
    } else {
      console.log(`File "${fileName}" does not exist in the folder. Skipping deletion.`);
    }
  } catch (error) {
    console.error(`Failed to delete file "${fileName}":`, error);
  }
}

// تصدير الدالة
module.exports = deleteFileFromFolder;
