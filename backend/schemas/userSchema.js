import { z } from 'zod';
import { createIdParamSchema } from './commonSchema.js';

/**
 * Schémas de validation pour la gestion des utilisateurs.
 */

export const userRoleEnum = z.enum(['ADMINISTRATEUR', 'CHEF_DE_PROJET', 'MEMBRE'], {
  errorMap: () => ({ message: 'Le rôle doit être ADMINISTRATEUR, CHEF_DE_PROJET ou MEMBRE' }),
});

export const userStatusEnum = z.enum(['EN_ATTENTE', 'ACTIF', 'INACTIF'], {
  errorMap: () => ({ message: 'Le statut doit être EN_ATTENTE, ACTIF ou INACTIF' }),
});

// Création d'un utilisateur par l'administrateur
export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Le nom complet est requis' })
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères'),
  email: z
    .string({ required_error: 'L’email est requis' })
    .trim()
    .toLowerCase()
    .email('Veuillez fournir une adresse email valide'),
  role: userRoleEnum,
});

// Mise à jour d'un utilisateur par l'administrateur
export const updateUserByAdminSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit comporter au moins 2 caractères').optional(),
  email: z.string().trim().toLowerCase().email('Email invalide').optional(),
  role: userRoleEnum.optional(),
});

// Mise à jour du profil par l'utilisateur connecté
export const updateMeSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit comporter au moins 2 caractères').optional(),
  email: z.string().trim().toLowerCase().email('Email invalide').optional(),
  avatar: z.string().url('L’URL de l’avatar est invalide').optional().or(z.literal('')),
});

// Changement de mot de passe par l'utilisateur connecté
export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Le mot de passe actuel est requis' })
    .min(1, 'Le mot de passe actuel ne peut pas être vide'),
  newPassword: z
    .string({ required_error: 'Le nouveau mot de passe est requis' })
    .min(6, 'Le nouveau mot de passe doit comporter au moins 6 caractères'),
});

// Mise à jour du rôle utilisateur (Admin)
export const updateUserRoleSchema = z.object({
  role: userRoleEnum,
});

// Paramètre d'ID utilisateur
export const userIdParamsSchema = createIdParamSchema('id');
