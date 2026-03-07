const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { io } = require('../../server');

// Configuration email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

exports.sendAlert = async (alert, recipients) => {
  try {
    // Notification en temps réel via WebSocket
    recipients.forEach(recipient => {
      io.to(`user-${recipient.id}`).emit('alert', alert);
    });

    // Envoyer emails
    const emails = recipients.map(r => r.email).filter(Boolean);
    if (emails.length > 0) {
      await transporter.sendMail({
        from: '"Sentinel" <alerts@sentinel.africa>',
        to: emails.join(','),
        subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
        html: `
          <h2>${alert.title}</h2>
          <p>${alert.message}</p>
          <p>Type: ${alert.type}</p>
          <p>Région: ${alert.region || alert.country}</p>
          <p><a href="${process.env.FRONTEND_URL}/threats/${alert.threatId}">Voir détails</a></p>
        `
      });
    }

    logger.info(`Alertes envoyées à ${recipients.length} destinataires`);
  } catch (error) {
    logger.error('Erreur envoi alertes:', error);
  }
};