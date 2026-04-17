import express from 'express';
import { getUsers, getMe, updateMe, updateUserRole } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Profil de l'utilisateur connecté
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// Liste de tous les utilisateurs
router.get('/', protect, getUsers);

// Changer le rôle d'un utilisateur (Admin)
router.put('/:id/role', protect, updateUserRole);

export default router;
