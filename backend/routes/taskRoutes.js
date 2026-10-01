import express from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskProjectParamsSchema,
  taskIdParamsSchema,
} from '../schemas/taskSchema.js';

const router = express.Router();

router.post('/:projectId', protect, validate({ params: taskProjectParamsSchema, body: createTaskSchema }), createTask);
router.put('/:taskId', protect, validate({ params: taskIdParamsSchema, body: updateTaskSchema }), updateTask);
router.delete('/:taskId', protect, validate({ params: taskIdParamsSchema }), deleteTask);

export default router;
