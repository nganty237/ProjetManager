import logger from '../utils/logger.js';

/**
 * Middleware d'interception et de journalisation des requêtes HTTP.
 * Mesure le temps de traitement et affiche les informations clés de chaque appel API.
 */
export const requestLogger = (req, res, next) => {
  // Ignorer les requêtes de pré-vol OPTIONS ou fichiers statiques très fréquents si nécessaire
  if (req.method === 'OPTIONS') {
    return next();
  }

  const startTime = process.hrtime();
  const originalEnd = res.end;

  // Intercepter la fin de la réponse pour calculer la durée et le statut
  res.end = function (...args) {
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    const statusCode = res.statusCode;

    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '-';
    const userAgent = req.headers['user-agent'] || 'Unknown-Agent';
    const userIdentifier = req.user ? `[User #${req.user.id} (${req.user.role})]` : '[Public]';

    const logMessage = `${req.method.padEnd(6)} ${req.originalUrl || req.url} -> ${statusCode} (${durationMs}ms) ${userIdentifier} - IP: ${ip}`;

    const meta = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode,
      durationMs: parseFloat(durationMs),
      ip,
      userId: req.user?.id,
      userAgent: userAgent.substring(0, 80),
    };

    logger.http(logMessage, meta);

    originalEnd.apply(this, args);
  };

  next();
};

export default requestLogger;
