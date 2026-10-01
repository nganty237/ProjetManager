import { z } from 'zod';
import { createIdParamSchema } from './commonSchema.js';

/**
 * Schémas de validation pour les projets.
 */

export const projectStatusEnum = z.enum(['active', 'completed', 'archived'], {
  errorMap: () => ({ message: 'Le statut doit être active, completed ou archived' }),
});

export const projectPriorityEnum = z.enum(['low', 'medium', 'high', 'critical'], {
  errorMap: () => ({ message: 'La priorité doit être low, medium, high ou critical' }),
});

export const createProjectSchema = z.object({
  title: z
    .string({ required_error: 'Le titre du projet est requis' })
    .trim()
    .min(2, 'Le titre doit comporter au moins 2 caractères')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  description: z.string().trim().optional().or(z.literal('')),
  status: projectStatusEnum.default('active'),
  priority: projectPriorityEnum.default('medium'),
  startDate: z.coerce.date().optional().or(z.string().optional()),
  endDate: z.coerce.date().optional().nullable().or(z.string().optional()),
  budgetAllocated: z.coerce.number().min(0, 'Le budget alloué ne peut pas être négatif').default(0),
  teamIds: z.array(z.string()).optional().default([]),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(2, 'Le titre doit comporter au moins 2 caractères').max(255).optional(),
  description: z.string().trim().optional().or(z.literal('')),
  status: projectStatusEnum.optional(),
  priority: projectPriorityEnum.optional(),
  startDate: z.coerce.date().optional().or(z.string().optional()),
  endDate: z.coerce.date().optional().nullable().or(z.string().optional()),
  budgetAllocated: z.coerce.number().min(0, 'Le budget alloué ne peut pas être négatif').optional(),
  teamIds: z.array(z.string()).optional(),
});

export const updateBudgetSchema = z.object({
  allocated: z.coerce.number({ required_error: 'Le montant alloué est requis' }).min(0, 'Le budget ne peut pas être négatif'),
});

export const projectIdParamsSchema = createIdParamSchema('id');
