import Expense from '../models/Expense.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

// Récupérer les dépenses d'un projet
// - Chef de projet propriétaire : autorisé
// - Administrateur : autorisé (supervision lecture seule)
// - Membre : non autorisé
export const getExpensesByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Projet non trouvé');
  }

  if (req.user.role === 'CHEF_DE_PROJET' && project.ownerId !== req.user.id) {
    res.status(403);
    throw new Error("Accès refusé : vous n'êtes pas le propriétaire de ce projet");
  }

  if (req.user.role === 'MEMBRE') {
    res.status(403);
    throw new Error("Accès refusé : les membres n'ont pas accès aux données financières");
  }

  const expenses = await Expense.findAll({
    where: { ProjectId: projectId },
    order: [['date', 'DESC']],
  });
  res.json(expenses);
});

// Créer une nouvelle dépense (Chef de projet propriétaire uniquement)
export const createExpense = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { label, amount, category, date, description } = req.body;

  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Projet non trouvé');
  }

  if (req.user.role !== 'CHEF_DE_PROJET' || project.ownerId !== req.user.id) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut enregistrer des dépenses");
  }

  const createdBy = req.user.name;

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

// Mettre à jour une dépense (Chef de projet propriétaire uniquement)
export const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findByPk(id, {
    include: [{ model: Project }]
  });

  if (!expense) {
    res.status(404);
    throw new Error('Dépense non trouvée');
  }

  const isOwner = req.user.role === 'CHEF_DE_PROJET' && expense.Project && expense.Project.ownerId === req.user.id;
  if (!isOwner) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut modifier cette dépense");
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

// Supprimer une dépense (Chef de projet propriétaire uniquement)
export const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await Expense.findByPk(id, {
    include: [{ model: Project }]
  });

  if (!expense) {
    res.status(404);
    throw new Error('Dépense non trouvée');
  }

  const isOwner = req.user.role === 'CHEF_DE_PROJET' && expense.Project && expense.Project.ownerId === req.user.id;
  if (!isOwner) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut supprimer cette dépense");
  }

  await expense.destroy();
  res.json({ message: 'Dépense supprimée avec succès' });
});
