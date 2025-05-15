import { Router, Request, Response } from "express";
import WhatsAppController from "../../controllers/message/whatsappController";

const whatsappRouter = Router();

whatsappRouter.get("/qrcode", async (req: Request, res: Response): Promise<void> =>
{
  await WhatsAppController.getQRCode(req, res);
  return;
}
);

whatsappRouter.post("/send-message", async (req: Request, res: Response): Promise<void> =>
    {
      await WhatsAppController.sendMessage(req, res);
      return;
    }
    );

whatsappRouter.post("/reset-qr", async (req: Request, res: Response): Promise<void> =>
    {
      await WhatsAppController.resetQRCode(req, res);
      return;
    }
);

export default whatsappRouter;