import { Request, Response, NextFunction } from 'express';
import { databaseService } from '../../database';
import { validationResult } from 'express-validator';
import {ApiError} from '../../errors/ApiError';
import DatabaseError from '../../errors/DatabaseError';
import {ValidationError} from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';

class AttachmentController {
  async getAllAttachments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dataFillter = req.query;
      const AttachmentService = databaseService.getAttachmentService();
      const attachments = await AttachmentService.getAllAttachments(dataFillter);
      res.status(200).json(attachments);
    } catch (error) {
      console.error(error);
      // Throwing error outside of async functions is not ideal, so using next() instead.
      next(new DatabaseError('Error retrieving beneficiary types.', error));
    }
  }

  async getAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const AttachmentService = databaseService.getAttachmentService();
      const attachment = await AttachmentService.getAttachmentById(id);
      if (!attachment) {
        return next(new NotFoundError(`Attachment with id ${id} not found.`));
      }
      res.status(200).json(attachment);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getAttachmentByAccreditedId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const AttachmentService = databaseService.getAttachmentService();
      const attachment = await AttachmentService.getAttachmentByAccreditedId(id);
      if (!attachment) {
        return next(new NotFoundError(`Attachment with id ${id} not found.`));
      }
      res.status(200).json(attachment);
    } catch (error) {
      console.error(error);
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async createAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const AttachmentService = databaseService.getAttachmentService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const filePath = req.file && (req.file as any).local ? (req.file as any).local : (req.file as any)?.s3?.Location;
      const AttachmentData = req.body;
      const newAttachment = await AttachmentService.createAttachment(AttachmentData, filePath);
      res.status(201).json(newAttachment);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async updateAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const AttachmentService = databaseService.getAttachmentService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const id = req.params.id;
      const AttachmentData = req.body;
      const updatedAttachment = await AttachmentService.updateAttachment(id, AttachmentData);
      if (!updatedAttachment) {
        return next(new NotFoundError(`Attachment with id ${id} not found.`));
      }
      res.status(200).json(updatedAttachment);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async deleteAttachment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const AttachmentService = databaseService.getAttachmentService();
      const id = req.params.id;
      await AttachmentService.deleteAttachment(id);
      res.status(200).json({ message: `The attachment with id ${id} has been successfully deleted` });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new AttachmentController();