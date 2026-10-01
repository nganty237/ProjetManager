import { z } from 'zod';

/**
 * Schémas de validation pour l'authentification et l'activation des comptes.
 */

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'L’email est requis' })
    .trim()
    .toLowerCase()
    .email('Veuillez fournir une adresse email valide'),
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe ne peut pas être vide'),
});

export const activateAccountSchema = z.object({
  token: z
    .string({ required_error: 'Le token d’invitation est requis' })
    .trim()
    .min(1, 'Le token d’invitation ne peut pas être vide'),
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
});

export const verifyInvitationParamsSchema = z.object({
  token: z
    .string({ required_error: 'Le token d’invitation est requis' })
    .trim()
    .min(1, 'Le token d’invitation ne peut pas être vide'),
});
