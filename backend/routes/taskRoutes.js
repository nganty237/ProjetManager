import express from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:projectId', protect, createTask);
router.put('/:taskId', protect, updateTask);
router.delete('/:taskId', protect, deleteTask);

export default router;
