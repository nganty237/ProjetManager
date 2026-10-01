import express from 'express';
import { 
  getUsers, 
  getMe, 
  createUser,
  resendInvitation,
  toggleUserStatus,
  updateUserByAdmin,
  updateMe, 
  updatePassword, 
  updateUserRole, 
  deleteUser 
} from '../controllers/userController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Profil de l'utilisateur connecté
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('avatarFile'), updateMe);
router.put('/me/password', protect, updatePassword);

// Liste de tous les utilisateurs (accessible à tous les utilisateurs authentifiés pour sélection d'équipe)
router.get('/', protect, getUsers);

// Création d'un utilisateur par l'administrateur (génère l'invitation)
router.post('/', protect, isAdmin, createUser);

// Renvoyer l'invitation
router.post('/:id/resend-invite', protect, isAdmin, resendInvitation);

// Activer / Désactiver un utilisateur
router.put('/:id/toggle-status', protect, isAdmin, toggleUserStatus);

// Mettre à jour un utilisateur par l'administrateur (nom, email, rôle)
router.put('/:id/admin-update', protect, isAdmin, updateUserByAdmin);

// Changer le rôle d'un utilisateur (Admin seulement)
router.put('/:id/role', protect, isAdmin, updateUserRole);

// Supprimer définitivement un utilisateur (Admin seulement)
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;
