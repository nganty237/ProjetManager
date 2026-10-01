import express from 'express';
import cors from 'cors';

// Import de la configuration et des logs
import config, { validateConfig } from './config/index.js';
import logger from './utils/logger.js';
import { requestLogger } from './middlewares/loggerMiddleware.js';

// Import de la base de données et des modèles
import { connectDB, sequelize } from './config/db.js';
import './models/index.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

// Import des middlewares et initialisations
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { initAdminAccount } from './utils/seedAdmin.js';

const app = express();
const log = logger.for('Server');

// Validation initiale de la configuration
validateConfig(logger);

// Middlewares globaux
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Journalisation des requêtes HTTP
app.use(requestLogger);

// Fichiers statiques (Uploads)
app.use('/uploads', express.static(config.upload.dir));

// Route de bienvenue
app.get('/', (req, res) => {
  res.json({
    name: config.app.name,
    version: '1.0.0',
    environment: config.app.env,
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
  });
});

// Route de Health Check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'DISCONNECTED';
  try {
    await sequelize.authenticate();
    dbStatus = 'CONNECTED';
  } catch {
    dbStatus = 'ERROR';
  }

  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'OK',
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      name: config.db.name,
      host: config.db.host,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      },
    },
  });
});

// Enregistrement des routes API
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Gestion des erreurs 404 & Globales
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur avec gestion du cycle de vie
let serverInstance = null;

const startServer = async () => {
  try {
    log.info(`Initializing application in [${config.app.env.toUpperCase()}] mode...`);

    // Connexion à la base de données
    await connectDB();

    // Synchronisation sécurisée des tables Sequelize
    await sequelize.sync();
    log.info('Database schema synchronized successfully.');

    // Initialisation du compte administrateur si nécessaire
    await initAdminAccount();

    // Démarrage de l'écoute HTTP
    serverInstance = app.listen(config.app.port, config.app.host, () => {
      log.info(`Server listening on http://${config.app.host === '0.0.0.0' ? 'localhost' : config.app.host}:${config.app.port}`);
      log.info(`API endpoints available at /api`);
      log.info(`Health check available at /api/health`);
    });
  } catch (error) {
    log.error(`Critical startup failure: ${error.message}`, error);
  }
};

// Gestion de l'arrêt propre (Graceful Shutdown)
const gracefulShutdown = async (signal) => {
  log.warn(`Received ${signal}. Starting graceful shutdown...`);
  
  if (serverInstance) {
    serverInstance.close(async () => {
      log.info('HTTP server closed.');
      try {
        await sequelize.close();
        log.info('Database connections closed.');
      } catch (err) {
        log.error(`Error closing database connection: ${err.message}`);
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled promise rejection:', reason instanceof Error ? reason : new Error(String(reason)));
});

process.on('uncaughtException', (err) => {
  log.error('Fatal uncaught exception:', err);
});

startServer();

export default app;
