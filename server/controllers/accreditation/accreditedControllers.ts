import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../../errors/ApiError';
import DatabaseError from '../../errors/DatabaseError';
import { ValidationError } from '../../errors/ValidationError';
import NotFoundError from '../../errors/NotFoundError';
import AccreditedService from '../../services/accreditation/accreditedServices';
import { PrismaClient } from '@prisma/client';

declare function uploadOrSaveFile(
  sourcePath: string,
  localDir: string,
  accreditedId: string,
  bucketName: string
): Promise<string>;

class AccreditedController {
  private prisma: PrismaClient;
  private accreditedService: AccreditedService;

  constructor() {
    // Initialize the accredited service using the databaseService
    this.prisma = new PrismaClient();
    this.accreditedService = new AccreditedService(this.prisma);
  }

  async fileUploadController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sourcePath, localDir, accreditedId, bucketName } = req.body;
      const result = await uploadOrSaveFile(sourcePath, localDir, accreditedId, bucketName);
      res.status(200).json({ message: result });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async filterAccredited(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { squareId, location, docter, state } = req.query;
      const squareIdv = parseInt(squareId as string, 10);
      const accreditedRecords = await
       this.accreditedService.filterAccreditedByDateAndLocation(
        squareIdv,
        location as string,
        docter as string,
        state as string
      );
      res.json(accreditedRecords);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getAllOrSearchApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchTerm = req.query;
      const Accredited = await this.accreditedService.searchAccreditations(searchTerm);
      res.status(200).json(Accredited);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getAllApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchTerm = req.query;
      const Accredited = await this.accreditedService.getAllAccreditations(searchTerm);
      res.status(200).json(Accredited);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getAccreditationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;
    try {
      const accreditation = await this.accreditedService.getAccreditationById(id);
      if (!accreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`));
      }
      res.status(200).json(accreditation);
    } catch (error) {
      next(error);
    }
  }

  async countAllAccredited(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await this.accreditedService.countAllAccredited();
      res.json({ count });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async createAccreditation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      // Assuming that req.atch and req.pt are set by a middleware.
      const fileAtch = (req as any).atch;
      const filePt = (req as any).pt;
      const AccreditedData = req.body;
      const newAccreditation = await this.accreditedService.createAccreditation(
        AccreditedData,
        fileAtch,
        filePt
      );
      res.status(201).json(newAccreditation);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async getPrintAccreditationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const accreditation = await this.accreditedService.getPrintAccreditationById(id);
      res.status(200).json(accreditation);
    } catch (error) {
      console.error('Controller Error:', error);
      next(new DatabaseError('Failed to retrieve accreditation', error));
    }
  }

  async updateAccreditation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError('Validation Failed', errors.array()));
    }
    const fileAtch = (req as any).atch;
    const filePt = (req as any).pt;
    const id = req.params.id;
    const AccreditedData = req.body;
    try {
      const updatedAccreditation = await this.accreditedService.updateAccreditation(
        id,
        AccreditedData,
        fileAtch,
        filePt
      );
      if (!updatedAccreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`));
      }
      res.status(200).json(updatedAccreditation);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async updateAccreditationState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()));
      }
      const id = req.params.id;
      const { state } = req.body;
      const updatedAccreditation = await this.accreditedService.updateAccreditationState(id, state);
      if (!updatedAccreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`));
      }
      res.status(200).json(updatedAccreditation);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async deleteAccreditation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const name = await this.accreditedService.deleteAccreditation(id);
      res.status(200).json({
        message: `The accreditation '${name}' has been successfully deleted`
      });
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async AccreditedByPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const Accredited = await this.accreditedService.AccreditedByPrescriptionServer();
      res.status(200).json(Accredited);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async exportAllBarcodeCardToPDFById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const accredited = await this.accreditedService.getAccreditationById(id);
      const dta = {
        number: accredited.numberOfRfid,
        formNumber: accredited.formNumber
      };
      res.status(200).send(dta);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', error instanceof Error ? error.message : error));
    }
  }

  async exportAllBarcodeCardToPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accrediteds = await this.accreditedService.getAllAccreditations();
      const card = accrediteds.map(data => ({
        number: data.numberOfRfid,
        formNumber: data.formNumber
      }));
      res.status(200).json(card);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }

  async AccreditedByPrescriptionServers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dataFilter = req.query;
      const accrediteds = await this.accreditedService.AccreditedByPrescriptionServer(dataFilter);
      res.status(200).json(accrediteds);
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    }
  }
}

export default new AccreditedController();