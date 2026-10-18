import logger from '../utils/logger.js';
import config from '../config/index.js';

const log = logger.for('Router');

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || 'Internal server error';

  let errors = undefined;

  // Format Zod validation errors
  if (err.name === 'ZodError' || err.issues) {
    statusCode = 400;
    message = 'Données de requête invalides';
    errors = err.issues ? err.issues.map((i) => ({
      field: i.path.join('.') || 'root',
      message: i.message,
    })) : [];
  }

  // Format Sequelize specific errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors ? err.errors.map((e) => e.message).join(', ') : err.message;
  }

  // Journalisation standard selon le niveau de gravité
  if (statusCode >= 500) {
    log.error(`Internal server error on ${req.method} ${req.originalUrl} - ${message}`, err);
  } else {
    log.warn(`Client error ${statusCode} on ${req.method} ${req.originalUrl} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(errors ? { errors } : {}),
    stack: config.app.isProd ? null : err.stack,
  });
};
