// upload.js

const { S3, HeadObjectCommand, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs').promises;
require('dotenv').config();

// إنشاء عميل S3
const s3 = new S3({
  region: 'ap-south-1',
  credentials: {
   accessKeyId: 'ACCESSKEYID=AKIAXHPAJTZ3TS53PTPK',
  secretAccessKey: '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'
  }

});

const MAX_SIZE = 2 * 1024 * 1024; // 2 ميجابايت
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, and WEBP files are allowed.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter
});

// وظيفة لتنزيل ملف من S3
async function downloadFileFromS3(bucketName, key, localFilePath) {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const data = await s3.send(command);

    if (data && data.Body) {
      const stream = data.Body;
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);
      await fs.writeFile(localFilePath, fileBuffer);
    } else {
      console.error(`No data returned for file: ${key}`);
    }
  } catch (error) {
    console.error(`Failed to download file from S3: ${key}`, error);
    throw error;
  }
}

// وظيفة للتحقق من وجود ملف في S3
async function checkFileExistenceInS3(bucketName, fileName) {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const command = new HeadObjectCommand(params);
    await s3.send(command);
    return true; // الملف موجود
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false; // الملف غير موجود
    }
    throw error;
  }
}

// وظيفة لرفع ملف إلى S3
async function uploadFileToS3(bucketName, filename, fileBuffer, mimeType) {
  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);
  try {
    await s3.send(command);
    return { success: true };
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

// وظيفة لقائمة الملفات في S3
async function listFilesInS3Bucket(bucketName) {
  try {
    const params = {
      Bucket: bucketName,
    };

    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);
    return data.Contents; // قائمة بالملفات
  } catch (error) {
    console.error('Error listing S3 bucket files:', error);
    throw error;
  }
}

module.exports = {
  upload,
  uploadFileToS3,
  checkFileExistenceInS3,
  downloadFileFromS3,
  listFilesInS3Bucket,
};
