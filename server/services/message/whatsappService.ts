// src/services/whatsapp.service.ts

import QRCode from "qrcode";
import { Client, LocalAuth, Message } from 'whatsapp-web.js';

class WhatsAppService {
  private client: Client;
  private qrCodeData: string | null = null;
  private isResetting: boolean = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.initialize();
  }

  private initialize(): void {
    this.client.removeAllListeners('qr');
    this.client.removeAllListeners('ready');
    this.client.removeAllListeners('auth_failure');

    this.client.on('qr', async (qr: string) => {
      try {
        const dataUrl = await QRCode.toDataURL(qr);
        this.qrCodeData = dataUrl;
      } catch (err) {
        console.error('خطأ أثناء توليد Data URL للرمز:', err);
      }
    });

    this.client.on('ready', () => {
      console.log('عميل واتساب جاهز!');
      this.qrCodeData = null;
    });

    this.client.on('auth_failure', (msg: string) => {
      console.error('فشل المصادقة:', msg);
    });

    this.client.initialize();
  }

  public async sendMessage(phone: string, message: string): Promise<Message | null> {
    try {
      const sanitized = phone.replace(/\D/g, '');
      const chatId = `${sanitized}@c.us`;
      const sent = await this.client.sendMessage(chatId, message);
      return sent;
    } catch (err) {
      console.error('خطأ أثناء إرسال الرسالة:', err);
      return null;
    }
  }

  public async resetClient(): Promise<void> {
    if (this.isResetting) return;
    this.isResetting = true;

    try {
      console.log('يتم الآن إعادة تهيئة عميل واتساب لإعادة توليد رمز QR...');
      await this.client.destroy();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      this.client = new Client({ authStrategy: new LocalAuth() });
      this.initialize();
    } catch (err) {
      console.error('خطأ أثناء إعادة تهيئة العميل:', err);
    } finally {
      this.isResetting = false;
    }
  }

  public getQRCode(): string | null {
    return this.qrCodeData;
  }
}

export default new WhatsAppService();
