const multer = require('multer')
const fs = require('fs').promises
const path = require('path')
const profileDir = 'D:\\Profiles'
require('dotenv').config()
const { v4: uuidv4 } = require('uuid') // استيراد دالة uuid

const MAX_SIZE = 1 * 1024 * 1024 * 1024

// تعديل أنواع الملفات المسموح بها لتشمل PDF، Word، وجميع أنواع الصور
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',              // PDF
    'application/msword',            // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'image/jpeg',                    // JPEG
    'image/png',                     // PNG
    'image/webp',                    // WEBP
    'image/gif',                     // GIF
    'image/bmp',                     // BMP
    'image/tiff'                     // TIFF
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, and image files are allowed.'), false)
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

  let fileName
  let destPath
  try {
    await fs.mkdir(profileDir, { recursive: true })

    if (req.files) {
      if (req.files.atch) {
        const uniqueId = uuidv4()
        const ext = path.extname(req.files.atch[0].originalname)
        fileName = `${uniqueId}${req.files.atch[0].originalname}`
        destPath = path.join(profileDir, fileName)
        req.atch = destPath
        await fs.writeFile(destPath, req.files.atch[0].buffer)
      }
      if (req.files.pt) {
        const uniqueId = uuidv4()
        const ext = path.extname(req.files.pt[0].originalname)
        fileName = `${uniqueId}${req.files.pt[0].originalname}`
        destPath = path.join(profileDir, fileName)
        req.pt = destPath
        await fs.writeFile(destPath, req.files.pt[0].buffer)
      }
    }

    if (req.file) {
      const ext = path.extname(req.file.originalname)
      fileName = `${uuidv4()}-Approved attachment${ext}`
      destPath = path.join(profileDir, fileName)
      req.file.local = destPath
      await fs.writeFile(destPath, req.file.buffer)
    }

    next()
  } catch (error) {
    console.error('Failed to write file in profile directory', error)
    next(error)
  }
}

module.exports = { upload, copyFileToProfileDir }
