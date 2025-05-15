import { Router, Request, Response, NextFunction, RequestHandler } from "express";
import AttachmentController from "../../controllers/attachment/attachmentController";
import { upload, copyFileToProfileDir } from "../../middleware/uploadLoacl";

const attachmentRouter = Router();

attachmentRouter.post(
  "/",
  upload.single("file"),
  (copyFileToProfileDir as unknown) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) => AttachmentController.createAttachment(req, res, next)
);

attachmentRouter.put(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => AttachmentController.updateAttachment(req, res, next)
);

attachmentRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => AttachmentController.getAllAttachments(req, res, next)
);

attachmentRouter.get(
  "/date/:id",
  (req: Request, res: Response, next: NextFunction) => AttachmentController.getAttachmentByAccreditedId(req, res, next)
);

attachmentRouter.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => AttachmentController.getAttachment(req, res, next)
);

attachmentRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => AttachmentController.deleteAttachment(req, res, next)
);

export { attachmentRouter };