const { databaseService } = require('../../database');
const { validationResult } = require('express-validator');
const ApiError = require('../../errors/ApiError');
const DatabaseError = require('../../errors/DatabaseError');
const ValidationError = require('../../errors/ValidationError');
const NotFoundError = require('../../errors/NotFoundError');
class AttachmentController {
  async getAllAttachments(req, res, next) {
    try {
      const dataFillter = req.query;
      const AttachmentService = databaseService.getAttachmentService();
      const attachments = await AttachmentService.getAllAttachments(dataFillter);
      res.status(200).json(attachments);
    } catch (error) {
      console.error(error);
      throw new DatabaseError('Error retrieving beneficiary types.', error);
    }
  }

  async getAttachment(req, res, next) {
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

  async getAttachmentByAccreditedId(req, res, next) {
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

  async createAttachment(req, res, next) {
    try {
      const AttachmentService = databaseService.getAttachmentService();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }

      const filePath = req.file.local ? req.file.local : req.file.s3.Location
      //  const filePath = req.file.s3.Location

      const AttachmentData = req.body;
      const newAttachment = await AttachmentService.createAttachment(AttachmentData, filePath);

      res.status(201).json(newAttachment);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async updateAttachment(req, res, next) {
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

  async deleteAttachment(req, res, next) {
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

module.exports = new AttachmentController();
