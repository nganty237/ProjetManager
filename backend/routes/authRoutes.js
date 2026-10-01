import express from 'express';
import { login, activateAccount, verifyInvitation } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authLimiter } from '../middlewares/rateLimitMiddleware.js';
import {
  loginSchema,
  activateAccountSchema,
  verifyInvitationParamsSchema,
} from '../schemas/authSchema.js';

const router = express.Router();

// Se connecter (protection anti-brute-force)
router.post('/login', authLimiter, validate(loginSchema), login);

// Vérifier le token d'invitation
router.get('/verify-invitation/:token', validate({ params: verifyInvitationParamsSchema }), verifyInvitation);

// Activer le compte (définir le mot de passe initial)
router.post('/activate', authLimiter, validate(activateAccountSchema), activateAccount);

export default router;
