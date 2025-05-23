import { Request, Response } from 'express';
import whatsappService from '../../services/message/whatsappService';

class WhatsAppController {
  async sendMessage(req: Request, res: Response): Promise<Response> {
    try {
      const { phone, message } = req.body || {};
      console.log('Received phone:', phone);
      console.log('Received message:', message);
      if (!phone || !message) {
        return res
          .status(400)
          .json({ error: 'Phone and message are required.' });
      }

      const result = await whatsappService.sendMessage(phone, message);
      if (result) {
        return res
          .status(200)
          .json({ success: true, message: 'Message sent successfully!' });
      } else {
        return res
          .status(500)
          .json({ success: false, message: 'Failed to send message.' });
      }
    } catch (err) {
      console.error('Controller Error:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  /**
   * GET /qr-code
   * Returns the current QR code data URL (if any)
   */
  async getQRCode(req: Request, res: Response): Promise<Response> {
    const qrCodeData = whatsappService.getQRCode();
    if (qrCodeData) {
      return res
        .status(200)
        .json({ qrCode: qrCodeData });
    } else {
      return res.status(404).json({
        message:
          'QR Code غير متاح حالياً. ربما تم تسجيل الدخول بالفعل أو لم يتم استلامه بعد.',
      });
    }
  }

  /**
   * POST /qr-code/reset
   * Forces the service to destroy and re-init, generating a fresh QR code
   */
  async resetQRCode(req: Request, res: Response): Promise<Response> {
    try {
      await whatsappService.resetClient();
      return res
        .status(200)
        .json({ message: 'تم مسح رمز QR وإعادة توليده بنجاح.' });
    } catch (err) {
      console.error('خطأ أثناء إعادة تهيئة رمز QR:', err);
      return res
        .status(500)
        .json({ message: 'حدث خطأ أثناء إعادة تهيئة رمز QR.' });
    }
  }
}

export default new WhatsAppController();