const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs").promises;
const Jimp = require("jimp");
const path = require("path");
const dns = require("dns").promises; // Make sure to import the promises API
const { promisify } = require("util");
const copyFile = promisify(fs.copyFile);
const profileDir = "C:\Profiles"; // Define where profiles are stored, adjust as necessary
require("dotenv").config();
AWS.config.update({
  region:'ap-south-1',
  accessKeyId: 'AKIAXHPAJTZ3RVODGSAL',
  secretAccessKey:'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',
  });
  const s3 = new AWS.S3();
const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, JPG, PNG, and WEBP files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter,
});


const downloadFileFromS3 = async (bucketName, key, downloadPath) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    await fs.writeFile(downloadPath, data.Body);
  } catch (err) {
    console.error(`Failed to download file: ${key}`, err);
    throw err;
  }
};

const checkFileInS3 = async (fileName) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
  };

  try {
    await s3.headObject(params).promise();
    return true; // File exists in S3
  } catch (error) {
    if (error.code === 'NotFound') {
      return false; // File does not exist in S3
    }
    throw error;
  }
};

const uploadFileToS3 = async (bucketName, filename, fileBuffer, mimeType) => {
  AWS.config.update({
    region:'ap-south-1',
    accessKeyId: 'AKIAXHPAJTZ3RVODGSAL',
    secretAccessKey:'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',
  });
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = { upload, uploadFileToS3, checkFileInS3,downloadFileFromS3 };
