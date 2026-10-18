import { z } from 'zod';

/**
 * Schémas réutilisables pour les paramètres et identifiants courants.
 */

// Validation d'identifiant UUID v4 standard
export const uuidSchema = z
  .string({ required_error: 'L’identifiant est requis' })
  .uuid('Format d’identifiant UUID invalide');

// Validation générique pour un paramètre d'ID dans l'URL
export const createIdParamSchema = (paramName = 'id') =>
  z.object({
    [paramName]: z
      .string({ required_error: `Le paramètre ${paramName} est requis` })
      .min(1, `Le paramètre ${paramName} ne peut pas être vide`),
  });

// Schéma standard pour { id: uuid }
export const idParamSchema = createIdParamSchema('id');

// Schéma standard pour la pagination et filtres optionnels
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
});
