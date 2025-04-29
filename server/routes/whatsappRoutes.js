// src/routes/whatsapp.routes.js

const { Router } = require('express');
const WhatsAppController = require('../controllers/whatsappController');

const whatsappRouter = Router();

whatsappRouter.get('/qrcode', (req, res) =>
  WhatsAppController.getQRCode(req, res)
);

whatsappRouter.post('/send-message', (req, res) =>
  WhatsAppController.sendMessage(req, res)
);

whatsappRouter.post('/reset-qr', (req, res) =>
  WhatsAppController.resetQRCode(req, res)
);

module.exports = whatsappRouter;
