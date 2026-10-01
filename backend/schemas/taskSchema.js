import { z } from 'zod';
import { createIdParamSchema } from './commonSchema.js';

/**
 * Schémas de validation pour les tâches.
 */

export const taskStatusEnum = z.enum(['todo', 'in-progress', 'review', 'done'], {
  errorMap: () => ({ message: 'Le statut doit être todo, in-progress, review ou done' }),
});

export const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'critical'], {
  errorMap: () => ({ message: 'La priorité doit être low, medium, high ou critical' }),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Le titre de la tâche est requis' })
    .trim()
    .min(2, 'Le titre doit comporter au moins 2 caractères')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  description: z.string().trim().optional().or(z.literal('')),
  status: taskStatusEnum.default('todo'),
  priority: taskPriorityEnum.default('medium'),
  dueDate: z.coerce.date().optional().nullable().or(z.string().optional()),
  assignedToId: z.string().trim().nullable().optional(),
  assignedTo: z.object({ id: z.string().optional() }).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(2, 'Le titre doit comporter au moins 2 caractères').max(255).optional(),
  description: z.string().trim().optional().or(z.literal('')),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z.coerce.date().optional().nullable().or(z.string().optional()),
  assignedToId: z.string().trim().nullable().optional(),
  assignedTo: z.object({ id: z.string().optional() }).optional(),
});

export const taskProjectParamsSchema = createIdParamSchema('projectId');
export const taskIdParamsSchema = createIdParamSchema('taskId');
