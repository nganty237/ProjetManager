import express from 'express';
import {
  login,
  activateAccount,
  verifyInvitation,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authLimiter, passwordLimiter } from '../middlewares/rateLimitMiddleware.js';
import {
  loginSchema,
  activateAccountSchema,
  verifyInvitationParamsSchema,
  forgotPasswordSchema,
  verifyResetTokenParamsSchema,
  resetPasswordSchema,
} from '../schemas/authSchema.js';

const router = express.Router();

// Se connecter (protection anti-brute-force)
router.post('/login', authLimiter, validate(loginSchema), login);

// Vérifier le token d'invitation
router.get('/verify-invitation/:token', validate({ params: verifyInvitationParamsSchema }), verifyInvitation);

// Activer le compte (définir le mot de passe initial)
router.post('/activate', authLimiter, validate(activateAccountSchema), activateAccount);

// Demande de réinitialisation de mot de passe oublié
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);

// Vérifier la validité d'un token de réinitialisation
router.get('/verify-reset-token/:token', validate({ params: verifyResetTokenParamsSchema }), verifyResetToken);

// Réinitialiser le mot de passe avec le token
router.post('/reset-password', passwordLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
