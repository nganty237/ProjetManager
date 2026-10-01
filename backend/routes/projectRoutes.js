import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  updateProjectBudget,
  deleteProject 
} from '../controllers/projectController.js';
import { protect, isChefDeProjet, isProjectOwner } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  updateBudgetSchema,
  projectIdParamsSchema,
} from '../schemas/projectSchema.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, isChefDeProjet, validate(createProjectSchema), createProject);

router.route('/:id/budget')
  .put(protect, isChefDeProjet, isProjectOwner, validate({ params: projectIdParamsSchema, body: updateBudgetSchema }), updateProjectBudget);

router.route('/:id')
  .get(protect, validate({ params: projectIdParamsSchema }), getProjectById)
  .put(protect, isChefDeProjet, isProjectOwner, validate({ params: projectIdParamsSchema, body: updateProjectSchema }), updateProject)
  .delete(protect, isChefDeProjet, isProjectOwner, validate({ params: projectIdParamsSchema }), deleteProject);

export default router;
