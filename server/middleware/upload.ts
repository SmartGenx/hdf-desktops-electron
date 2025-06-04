import { S3Client, HeadObjectCommand, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAXHPAJTZ3TS53PTPK',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  },
});

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, and WEBP files are allowed.'));
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

async function downloadFileFromS3(bucketName: string, key: string, localFilePath: string): Promise<void> {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const data = await s3.send(command);

    if (data.Body) {
      const stream = data.Body as NodeJS.ReadableStream;
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk));
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

async function checkFileExistenceInS3(bucketName: string, fileName: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: fileName });
    await s3.send(command);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

async function uploadFileToS3(bucketName: string, filename: string, fileBuffer: Buffer, mimeType: string): Promise<{ success: boolean }> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: mimeType,
    });
    await s3.send(command);
    return { success: true };
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

async function listFilesInS3Bucket(bucketName: string): Promise<{ Key?: string }[] | undefined> {
  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const data = await s3.send(command);
    return data.Contents;
  } catch (error) {
    console.error('Error listing S3 bucket files:', error);
    throw error;
  }
}

export {
  upload,
  uploadFileToS3,
  checkFileExistenceInS3,
  downloadFileFromS3,
  listFilesInS3Bucket,
};
