// src/services/whatsapp.service.js

const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

class WhatsAppService {
  constructor() {
    this.qrCodeData = null;
    this.isResetting = false;

    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.initialize();
  }

  initialize() {
    // إزالة أي مستمعين قديمين
    this.client.removeAllListeners('qr');
    this.client.removeAllListeners('ready');
    this.client.removeAllListeners('auth_failure');

    this.client.on('qr', async (qr) => {
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

    this.client.on('auth_failure', (msg) => {
      console.error('فشل المصادقة:', msg);
    });

    this.client.initialize();
  }

  async sendMessage(phone, message) {
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

  async resetClient() {
    if (this.isResetting) return;
    this.isResetting = true;

    try {
      console.log('يتم الآن إعادة تهيئة عميل واتساب لإعادة توليد رمز QR...');
      await this.client.destroy();
      await new Promise((r) => setTimeout(r, 5000));
      this.client = new Client({ authStrategy: new LocalAuth() });
      this.initialize();
    } catch (err) {
      console.error('خطأ أثناء إعادة تهيئة العميل:', err);
    } finally {
      this.isResetting = false;
    }
  }
}

module.exports = new WhatsAppService();
