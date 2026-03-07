const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const sequelize = require('./src/config/database');
const redis = require('./src/config/redis');
const logger = require('./src/utils/logger');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// WebSocket pour les mises à jour en temps réel
io.on('connection', (socket) => {
  logger.info('Nouvelle connexion WebSocket:', socket.id);
  
  socket.on('join-threat-room', (region) => {
    socket.join(`threats-${region}`);
  });

  socket.on('disconnect', () => {
    logger.info('Déconnexion WebSocket:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/threats', require('./src/routes/threats.routes'));
app.use('/api/nodes', require('./src/routes/nodes.routes'));
app.use('/api/community', require('./src/routes/community.routes'));
app.use('/api/federated', require('./src/routes/federated.routes'));
app.use('/api/stats', require('./src/routes/stats.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erreur interne du serveur',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

async function startServer() {
  let retries = 0;
  const maxRetries = 30;
  
  async function connectDB() {
    try {
      // Connexion à la base de données
      await sequelize.authenticate();
      logger.info('Connexion à PostgreSQL établie');
      
      await sequelize.sync({ alter: true });
      logger.info('Modèles synchronisés');

      // Redis se connecte automatiquement via les event listeners
      // Pas besoin d'appeler connect() explicitement
      
      // Vérifier que Redis est prêt
      if (!redis.status || redis.status === 'connecting') {
        logger.warn('Redis en attente de connexion...');
        await new Promise((resolve) => {
          redis.once('ready', resolve);
          redis.once('connect', resolve);
        });
      }

      // Démarrage du serveur
      httpServer.listen(PORT, () => {
        logger.info(`Serveur démarré sur le port ${PORT}`);
      });
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        logger.error('Erreur au démarrage après retries:', error);
        process.exit(1);
      }
      
      const delay = Math.min(1000 * Math.pow(2, retries - 1), 10000);
      logger.warn(`Erreur connexion BD, tentative ${retries}/${maxRetries} dans ${delay}ms:`, error.message);
      setTimeout(connectDB, delay);
    }
  }
  
  connectDB();
}

startServer();

module.exports = { app, io };