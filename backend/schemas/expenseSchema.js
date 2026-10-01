import { z } from 'zod';
import { createIdParamSchema } from './commonSchema.js';

/**
 * Schémas de validation pour les dépenses de projet.
 */

export const expenseCategoryEnum = z.enum(
  ['personnel', 'software', 'hardware', 'subcontracting', 'marketing', 'travel', 'other'],
  {
    errorMap: () => ({
      message: 'Catégorie invalide (personnel, software, hardware, subcontracting, marketing, travel, other)',
    }),
  }
);

export const createExpenseSchema = z.object({
  label: z
    .string({ required_error: 'Le libellé de la dépense est requis' })
    .trim()
    .min(1, 'Le libellé ne peut pas être vide')
    .max(255, 'Le libellé ne peut pas dépasser 255 caractères'),
  amount: z.coerce
    .number({ required_error: 'Le montant de la dépense est requis' })
    .min(0, 'Le montant ne peut pas être négatif'),
  category: expenseCategoryEnum.default('other'),
  date: z.coerce.date().optional().or(z.string().optional()),
  description: z.string().trim().optional().nullable().or(z.literal('')),
});

export const updateExpenseSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé ne peut pas être vide').max(255).optional(),
  amount: z.coerce.number().min(0, 'Le montant ne peut pas être négatif').optional(),
  category: expenseCategoryEnum.optional(),
  date: z.coerce.date().optional().or(z.string().optional()),
  description: z.string().trim().optional().nullable().or(z.literal('')),
});

export const expenseProjectParamsSchema = createIdParamSchema('projectId');
export const expenseIdParamsSchema = createIdParamSchema('id');
