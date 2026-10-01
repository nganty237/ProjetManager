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
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createUserSchema,
  updateUserByAdminSchema,
  updateMeSchema,
  updatePasswordSchema,
  updateUserRoleSchema,
  userIdParamsSchema,
} from '../schemas/userSchema.js';

const router = express.Router();

// Profil de l'utilisateur connecté
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('avatarFile'), validate(updateMeSchema), updateMe);
router.put('/me/password', protect, validate(updatePasswordSchema), updatePassword);

// Liste de tous les utilisateurs (accessible à tous les utilisateurs authentifiés pour sélection d'équipe)
router.get('/', protect, getUsers);

// Création d'un utilisateur par l'administrateur (génère l'invitation)
router.post('/', protect, isAdmin, validate(createUserSchema), createUser);

// Renvoyer l'invitation
router.post('/:id/resend-invite', protect, isAdmin, validate({ params: userIdParamsSchema }), resendInvitation);

// Activer / Désactiver un utilisateur
router.put('/:id/toggle-status', protect, isAdmin, validate({ params: userIdParamsSchema }), toggleUserStatus);

// Mettre à jour un utilisateur par l'administrateur (nom, email, rôle)
router.put('/:id/admin-update', protect, isAdmin, validate({ params: userIdParamsSchema, body: updateUserByAdminSchema }), updateUserByAdmin);

// Changer le rôle d'un utilisateur (Admin seulement)
router.put('/:id/role', protect, isAdmin, validate({ params: userIdParamsSchema, body: updateUserRoleSchema }), updateUserRole);

// Supprimer définitivement un utilisateur (Admin seulement)
router.delete('/:id', protect, isAdmin, validate({ params: userIdParamsSchema }), deleteUser);

export default router;
