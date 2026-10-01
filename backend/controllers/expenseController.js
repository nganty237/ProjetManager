import asyncHandler from '../utils/asyncHandler.js';
import * as expenseService from '../services/expenseService.js';

// Récupérer les dépenses d'un projet
export const getExpensesByProject = asyncHandler(async (req, res) => {
  const expenses = await expenseService.findExpensesByProject(req.params.projectId, req.user);
  res.json(expenses);
});

// Créer une nouvelle dépense
export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createNewExpense(req.params.projectId, req.body, req.user);
  res.status(201).json(expense);
});

// Mettre à jour une dépense
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExistingExpense(req.params.id, req.body, req.user);
  res.json(expense);
});

// Supprimer une dépense
export const deleteExpense = asyncHandler(async (req, res) => {
  const result = await expenseService.deleteExpenseById(req.params.id, req.user);
  res.json(result);
});
