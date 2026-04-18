import express from 'express';
import { getUsers, getMe, updateMe, updatePassword, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Profil de l'utilisateur connecté
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

router.put('/me/password', protect, updatePassword);

// Liste de tous les utilisateurs
router.get('/', protect, getUsers);

// Changer le rôle d'un utilisateur (Admin seulement)
router.put('/:id/role', protect, isAdmin, updateUserRole);

// Supprimer un utilisateur (Admin seulement)
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;
