import Expense from '../models/Expense.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

// Récupérer les dépenses d'un projet
export const getExpensesByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const expenses = await Expense.findAll({
    where: { ProjectId: projectId },
    order: [['date', 'DESC']],
  });
  res.json(expenses);
});

// Créer une nouvelle dépense
export const createExpense = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { label, amount, category, date, description } = req.body;

  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Projet non trouvé');
  }

  const createdBy = req.user ? req.user.name : 'Utilisateur';

  const expense = await Expense.create({
    label,
    amount: Number(amount) || 0,
    category: category || 'other',
    date: date || new Date(),
    description,
    createdBy,
    ProjectId: projectId,
  });

  res.status(201).json(expense);
});

// Mettre à jour une dépense
export const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findByPk(id);

  if (!expense) {
    res.status(404);
    throw new Error('Dépense non trouvée');
  }

  const { label, amount, category, date, description } = req.body;

  await expense.update({
    label: label !== undefined ? label : expense.label,
    amount: amount !== undefined ? Number(amount) : expense.amount,
    category: category !== undefined ? category : expense.category,
    date: date !== undefined ? date : expense.date,
    description: description !== undefined ? description : expense.description,
  });

  res.json(expense);
});

// Supprimer une dépense
export const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findByPk(id);

  if (!expense) {
    res.status(404);
    throw new Error('Dépense non trouvée');
  }

  await expense.destroy();
  res.json({ message: 'Dépense supprimée avec succès' });
});
