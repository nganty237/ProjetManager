import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  updateProjectBudget,
  deleteProject 
} from '../controllers/projectController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, isAdmin, createProject);

router.route('/:id/budget')
  .put(protect, isAdmin, updateProjectBudget);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, isAdmin, updateProject)
  .delete(protect, isAdmin, deleteProject);

export default router;
