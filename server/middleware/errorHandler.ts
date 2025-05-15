import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    if (err.message === 'Invalid file type. Only PDF, Word, and image files are allowed.') {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};

export default errorHandler;