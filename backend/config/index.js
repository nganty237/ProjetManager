import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Charger le fichier .env
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';

const cwd = process.cwd();
const uploadDir = path.resolve(cwd, process.env.UPLOAD_DIR || 'uploads');
const logDir = path.resolve(cwd, process.env.LOG_DIR || 'logs');

// Assurer l'existence des répertoires de stockage (uploads, logs)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const config = {
  app: {
    name: 'Project Manager API',
    env: NODE_ENV,
    isDev,
    isProd,
    isTest,
    port: parseInt(process.env.PORT, 10) || 8080,
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: '/api',
  },

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    name: process.env.DB_NAME || 'project_manager',
    dialect: 'mysql',
    logging: process.env.DB_LOGGING === 'true',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
      min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 60000,
      idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
    },
    connectTimeout: 60000,
    retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS, 10) || 5,
    retryDelayMs: parseInt(process.env.DB_RETRY_DELAY_MS, 10) || 2000,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((item) => item.trim())
      : '*',
    credentials: true,
  },

  admin: {
    name: process.env.ADMIN_NAME || 'Administrateur Principal',
    email: (process.env.ADMIN_EMAIL || 'admin@admin.com').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },

  upload: {
    dir: uploadDir,
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // 10 Mo
  },

  log: {
    level: (process.env.LOG_LEVEL || (isDev ? 'debug' : 'info')).toLowerCase(),
    dir: logDir,
    fileLogging: process.env.FILE_LOGGING !== 'false',
    maxLogSize: parseInt(process.env.MAX_LOG_SIZE, 10) || 5 * 1024 * 1024,
  },
};

/**
 * Validation des variables d'environnement et diagnostic initial
 */
export const validateConfig = (loggerInstance) => {
  const log = loggerInstance?.for ? loggerInstance.for('Config') : loggerInstance || console;

  if (isProd && config.jwt.secret.includes('dev_secret')) {
    log.warn('Security Warning: Default JWT_SECRET is currently used in production environment.');
  }

  if (isNaN(config.app.port)) {
    log.error(`Invalid PORT specified (${process.env.PORT}). Falling back to default port.`);
  }

  if (isNaN(config.db.port)) {
    log.error(`Invalid DB_PORT specified (${process.env.DB_PORT}). Falling back to default MySQL port.`);
  }
};

export default config;
