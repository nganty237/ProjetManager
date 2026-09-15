import express from 'express';
import { login, activateAccount, verifyInvitation } from '../controllers/authController.js';

const router = express.Router();

// Se connecter
router.post('/login', login);

// Vérifier le token d'invitation
router.get('/verify-invitation/:token', verifyInvitation);

// Activer le compte (définir le mot de passe initial)
router.post('/activate', activateAccount);

export default router;
