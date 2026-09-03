import express from 'express';
import {
  getExpensesByProject,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/:projectId')
  .get(protect, getExpensesByProject)
  .post(protect, createExpense);

router.route('/item/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

// Support both /item/:id and direct /:id for flexible frontend consumption
router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

export default router;
