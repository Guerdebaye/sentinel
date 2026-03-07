const winston = require('winston');
const path = require('path');

// Définir les niveaux de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Définir les couleurs pour chaque niveau
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Ajouter les couleurs à winston
winston.addColors(colors);

// Format de log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Définir les transports (où écrire les logs)
const transports = [
  // Console
  new winston.transports.Console(),
  
  // Fichier pour toutes les erreurs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Fichier pour tous les logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Créer le logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports,
});

// Si on n'est pas en production, logger aussi dans un fichier séparé pour le debug
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({
    filename: path.join(__dirname, '../../logs/debug.log'),
    level: 'debug',
    maxsize: 5242880,
    maxFiles: 2,
  }));
}

// Middleware pour logger les requêtes HTTP
logger.httpLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - ${req.ip}`
    );
  });
  
  next();
};

// Fonction pour logger les erreurs avec contexte
logger.logError = (error, context = {}) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context
  });
};

// Fonction pour logger les événements utilisateur
logger.logUserAction = (userId, action, details = {}) => {
  logger.info(`User ${userId}: ${action}`, details);
};

// Fonction pour logger les événements système
logger.logSystemEvent = (event, details = {}) => {
  logger.info(`System: ${event}`, details);
};

// Créer le dossier logs s'il n'existe pas
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

module.exports = logger;