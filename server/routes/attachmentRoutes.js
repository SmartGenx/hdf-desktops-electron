const Router = require('express');
const AttachmentController = require('../controllers/attachmentController');
const { upload, copyFileToProfileDir } = require("../middleware/uploadLoacl"); // Ensure you have an AttachmentController
// const { upload, uploadFileToS3 } = require("../middleware/upload"); // Ensure you have an AttachmentController
const attachmentRouter = Router();

// attachmentRouter.post('/', upload.single("file"),
//     copyFileToProfileDir(), AttachmentController.createAttachment);
attachmentRouter.post('/', upload.single("file"),
copyFileToProfileDir(), AttachmentController.createAttachment);
attachmentRouter.put('/:id', AttachmentController.updateAttachment);
attachmentRouter.get('/', AttachmentController.getAllAttachments);
attachmentRouter.get('/date/:id', AttachmentController.getAttachmentByAccreditedId);
attachmentRouter.get('/:id', AttachmentController.getAttachment);
attachmentRouter.delete('/:id', AttachmentController.deleteAttachment);

module.exports = { attachmentRouter };
