import express from 'express';
import {
  getExpensesByProject,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseProjectParamsSchema,
  expenseIdParamsSchema,
} from '../schemas/expenseSchema.js';

const router = express.Router();

router.route('/:projectId')
  .get(protect, validate({ params: expenseProjectParamsSchema }), getExpensesByProject)
  .post(protect, validate({ params: expenseProjectParamsSchema, body: createExpenseSchema }), createExpense);

router.route('/item/:id')
  .put(protect, validate({ params: expenseIdParamsSchema, body: updateExpenseSchema }), updateExpense)
  .delete(protect, validate({ params: expenseIdParamsSchema }), deleteExpense);

// Support both /item/:id and direct /:id for flexible frontend consumption
router.route('/:id')
  .put(protect, validate({ params: expenseIdParamsSchema, body: updateExpenseSchema }), updateExpense)
  .delete(protect, validate({ params: expenseIdParamsSchema }), deleteExpense);

export default router;
