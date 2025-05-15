import multer, { FileFilterCallback } from 'multer'
import { promises as fs } from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

const profileDir = 'D:\\Profiles'
const MAX_SIZE = 5 * 1024 * 1024

// Extend Express.Multer.File to include 'local' property
declare global {
    namespace Express {
        namespace Multer {
            interface File {
                local?: string
            }
        }
    }
}

// Extend Express Request to include multer properties and custom properties
export interface MulterRequest extends Request {
    file?: Express.Multer.File
    files?: {
        [fieldname: string]: Express.Multer.File[]
    }
    atch?: string
    pt?: string
}

// تعديل أنواع الملفات المسموح بها لتشمل PDF، Word، وجميع أنواع الصور
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const allowedTypes = [
        'application/pdf', // PDF
        'image/jpeg',      // JPEG
        'image/png',       // PNG
        'image/webp',      // WEBP
        'image/gif',       // GIF
        'image/bmp',       // BMP
        'image/tiff'       // TIFF
    ]

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Only PDF, Word, and image files are allowed.') as any, false)
    }
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_SIZE },
    fileFilter: fileFilter
})

const copyFileToProfileDir = () => async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.file && !req.files) {
        return next(new Error('No file uploaded'))
    }

    let fileName: string
    let destPath: string
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

export { upload, copyFileToProfileDir }