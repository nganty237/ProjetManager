import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const log = logger.for('RateLimit');

/**
 * Gestionnaire standardisé de dépassement de quota (HTTP 429).
 */
const createRateLimitHandler = (customMessage) => (req, res, _next, options) => {
  const retryAfterSeconds = Math.ceil(options.windowMs / 1000);
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  log.warn(`Rate limit exceeded for IP ${clientIp} on [${req.method}] ${req.originalUrl}`);

  res.status(429).json({
    success: false,
    message: customMessage || 'Trop de requêtes effectuées. Veuillez patienter avant de réessayer.',
    statusCode: 429,
    retryAfter: retryAfterSeconds,
  });
};

/**
 * Usine (Factory) de création de middleware de rate limiting configuré selon les standards actuels.
 * 
 * @param {Object} options - Options de configuration
 * @param {number} options.windowMs - Fenêtre temporelle en millisecondes
 * @param {number} options.max - Nombre maximal de requêtes autorisées dans la fenêtre
 * @param {string} [options.message] - Message d'erreur personnalisé
 * @param {Function} [options.skip] - Fonction optionnelle pour ignorer certaines requêtes
 */
export const createRateLimiter = ({
  windowMs,
  max,
  message,
  skip,
}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => {
      if (!config.rateLimit.enabled) return true;
      if (typeof skip === 'function') return skip(req, res);
      return false;
    },
    handler: createRateLimitHandler(message),
  });
};

/**
 * Limiteur global appliqué à l'ensemble des routes de l'API.
 * Protège l'infrastructure contre les abus et le déni de service (DDoS).
 */
export const globalApiLimiter = createRateLimiter({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  message: 'Trop de requêtes adressées à l’API. Veuillez ralentir.',
  skip: (req) => req.path === '/health' || req.path === '/api/health',
});

/**
 * Limiteur strict pour l'authentification (Protection contre les attaques par force brute).
 * Appliqué sur /api/auth/login et /api/auth/activate.
 */
export const authLimiter = createRateLimiter({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  message: 'Trop de tentatives de connexion ou d’activation. Veuillez réessayer dans quelques minutes.',
});

/**
 * Limiteur pour les opérations sensibles de sécurité (Modification de mot de passe).
 */
export const passwordLimiter = createRateLimiter({
  windowMs: config.rateLimit.sensitive.windowMs,
  max: config.rateLimit.sensitive.max,
  message: 'Trop de tentatives de changement de mot de passe. Veuillez patienter.',
});

/**
 * Limiteur pour l'envoi / renvoi d'invitations (Protection contre le spam d'emails/tokens).
 */
export const inviteLimiter = createRateLimiter({
  windowMs: config.rateLimit.sensitive.windowMs,
  max: config.rateLimit.sensitive.max,
  message: 'Trop de demandes d’invitation générées. Veuillez patienter avant de renvoyer.',
});

export default {
  createRateLimiter,
  globalApiLimiter,
  authLimiter,
  passwordLimiter,
  inviteLimiter,
};
