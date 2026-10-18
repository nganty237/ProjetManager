import { z } from 'zod';

/**
 * Normalise les erreurs Zod en un tableau lisible et standardisé.
 * 
 * @param {import('zod').ZodError} error - L'erreur Zod capturée
 * @returns {Array<{ field: string, message: string }>}
 */
export const formatZodIssues = (error) => {
  if (!error?.issues) return [];
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
};

/**
 * Middleware d'ordre supérieur pour valider les requêtes Express avec Zod.
 * 
 * Permet de valider 'body', 'params', et 'query' de manière unifiée et sûre.
 * Remplace automatiquement les données brutes par les données typées et assainies (strip/coercion).
 * 
 * @example
 * // Valider uniquement le corps de la requête
 * router.post('/login', validate(loginSchema), loginController);
 * 
 * @example
 * // Valider le corps et les paramètres de route
 * router.put('/:id', validate({ params: idParamSchema, body: updateSchema }), updateController);
 * 
 * @param {import('zod').ZodSchema | { body?: import('zod').ZodSchema, params?: import('zod').ZodSchema, query?: import('zod').ZodSchema }} schemas
 */
export const validate = (schemas) => {
  return async (req, res, next) => {
    try {
      // Cas où un schéma simple est passé directement (valide req.body par défaut)
      if (schemas && typeof schemas.safeParse === 'function') {
        const result = await schemas.safeParseAsync(req.body);
        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: 'Données de requête invalides',
            errors: formatZodIssues(result.error),
          });
        }
        req.body = result.data;
        return next();
      }

      // Cas où un objet { body, params, query } est fourni
      const { body: bodySchema, params: paramsSchema, query: querySchema } = schemas || {};

      if (paramsSchema) {
        const result = await paramsSchema.safeParseAsync(req.params);
        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: 'Paramètres d’URL invalides',
            errors: formatZodIssues(result.error),
          });
        }
        req.params = result.data;
      }

      if (querySchema) {
        const result = await querySchema.safeParseAsync(req.query);
        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: 'Paramètres de requête (query) invalides',
            errors: formatZodIssues(result.error),
          });
        }
        req.query = result.data;
      }

      if (bodySchema) {
        const result = await bodySchema.safeParseAsync(req.body);
        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: 'Corps de requête (body) invalide',
            errors: formatZodIssues(result.error),
          });
        }
        req.body = result.data;
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

/**
 * Raccourci pour valider uniquement le body.
 */
export const validateBody = (schema) => validate({ body: schema });

/**
 * Raccourci pour valider uniquement les paramètres d'URL (req.params).
 */
export const validateParams = (schema) => validate({ params: schema });

/**
 * Raccourci pour valider uniquement la query string (req.query).
 */
export const validateQuery = (schema) => validate({ query: schema });

export default validate;
