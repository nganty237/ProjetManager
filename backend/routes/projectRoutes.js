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

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, isChefDeProjet, createProject);

router.route('/:id/budget')
  .put(protect, isChefDeProjet, isProjectOwner, updateProjectBudget);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, isChefDeProjet, isProjectOwner, updateProject)
  .delete(protect, isChefDeProjet, isProjectOwner, deleteProject);

export default router;
