const multer = require('multer')
const fs = require('fs').promises
const path = require('path')
const profileDir = 'D:\\Profiles'
require('dotenv').config()
const { v4: uuidv4 } = require('uuid') // استيراد دالة uuid

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, and WEBP files are allowed.'), false)
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter
})

const copyFileToProfileDir = () => async (req, res, next) => {
  if (!req.file && !req.files) {
    return next(new Error('No file uploaded'))
  }

  // Generate a filename based on upload time and original name to avoid conflicts

  let fileName
  let destPath
  try {
    // Ensure the directory exists
    await fs.mkdir(profileDir, { recursive: true })
    if (req.files) {
      if (req.files.atch) {
        const ext = path.extname(req.files.atch[0].originalname)
        fileName = `${req.files.atch[0].originalname}${ext}`
        destPath = path.join(profileDir, fileName)
        console.log(':rocket: ~ copyFileToProfileDir ~ destPath:', destPath)
        req.atch = destPath
        await fs.writeFile(destPath, req.files.atch[0].buffer)
      }
      if (req.files.pt) {
        console.log(':rocket: ~ copyFileToProfileDir ~ req.files.pt:', req.files.pt)
        const ext = path.extname(req.files.pt[0].originalname)
        fileName = `${req.files.pt[0].originalname}${ext}`
        destPath = path.join(profileDir, fileName)
        console.log(':rocket: ~ copyFileToProfileDir ~ destPath:', destPath)
        req.pt = destPath
        await fs.writeFile(destPath, req.files.pt[0].buffer)
      }
    }

    // Write the buffer to a new file in the profile directory
    if (req.file) {
      const ext = path.extname(req.file.originalname)
      fileName = `${uuidv4()}-Approved attachments${ext}` // توليد اسم فريد جديد مع الامتداد الأصلي

      destPath = path.join(profileDir, fileName)
      req.file.local = destPath
      await fs.writeFile(destPath, req.file.buffer)
    }

    // Proceed to next middleware or route handler
    next()
  } catch (error) {
    console.error('Failed to write file in profile directory', error)
    next(error)
  }
}
// const copyFileToProfileDir = () => async (req, res, next) => {
//   if (!req.file && !req.files) {
//     return next(new Error('No file uploaded'));
//   }

//   let destPath;
//   try {
//     // Ensure the directory exists
//     await fs.mkdir(profileDir, { recursive: true });

//     // If multiple files are uploaded
//     if (req.files) {
//       if (req.files.atch) {
//         const ext = path.extname(req.files.atch[0].originalname);
//         const fileName = `${uuidv4()}-Approved attachments${ext}`;
//         destPath = path.join(profileDir, fileName); // Full file path
//         req.atch = destPath; // Store the full path
//         console.log('🚀 ~ copyFileToProfileDir ~ req.atch:', req.atch);

//         await fs.writeFile(destPath, req.files.atch[0].buffer);
//       }
//       if (req.files.pt) {
//         const ext = path.extname(req.files.pt[0].originalname);
//         const fileName = `${uuidv4()}-Approved attachments${ext}`;
//         destPath = path.join(profileDir, fileName); // Full file path
//         req.pt = destPath; // Store the full path
//         await fs.writeFile(destPath, req.files.pt[0].buffer);
//       }
//     }

//     // If a single file is uploaded
//     if (req.file) {
//       const ext = path.extname(req.file.originalname);
//       const fileName = `${uuidv4()}-Approved attachments${ext}`;
//       destPath = path.join(profileDir, fileName); // Full file path
//       req.file.local = destPath; // Store the full path
//       await fs.writeFile(destPath, req.file.buffer);
//     }

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error('Failed to write file in profile directory', error);
//     next(error);
//   }
// };

module.exports = { upload, copyFileToProfileDir }
