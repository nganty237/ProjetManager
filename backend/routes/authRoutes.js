import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// S'inscrire
router.post('/signup', register);

// Se connecter
router.post('/login', login);

export default router;
