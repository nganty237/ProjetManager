import Expense from '../models/Expense.js';
import Project from '../models/Project.js';

/**
 * Récupère les dépenses d'un projet selon les permissions.
 */
export const findExpensesByProject = async (projectId, user) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    const error = new Error('Projet non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'CHEF_DE_PROJET' && project.ownerId !== user.id) {
    const error = new Error("Accès refusé : vous n'êtes pas le propriétaire de ce projet");
    error.statusCode = 403;
    throw error;
  }

  if (user.role === 'MEMBRE') {
    const error = new Error("Accès refusé : les membres n'ont pas accès aux données financières");
    error.statusCode = 403;
    throw error;
  }

  return await Expense.findAll({
    where: { ProjectId: projectId },
    order: [['date', 'DESC']],
  });
};

/**
 * Enregistre une nouvelle dépense pour un projet (Propriétaire uniquement).
 */
export const createNewExpense = async (projectId, data, user) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    const error = new Error('Projet non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'CHEF_DE_PROJET' || project.ownerId !== user.id) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut enregistrer des dépenses');
    error.statusCode = 403;
    throw error;
  }

  const { label, amount, category, date, description } = data;

  return await Expense.create({
    label,
    amount: Number(amount) || 0,
    category: category || 'other',
    date: date || new Date(),
    description,
    createdBy: user.name,
    ProjectId: projectId,
  });
};

/**
 * Met à jour une dépense (Propriétaire uniquement).
 */
export const updateExistingExpense = async (expenseId, data, user) => {
  const expense = await Expense.findByPk(expenseId, {
    include: [{ model: Project }],
  });

  if (!expense) {
    const error = new Error('Dépense non trouvée');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = user.role === 'CHEF_DE_PROJET' && expense.Project && expense.Project.ownerId === user.id;
  if (!isOwner) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut modifier cette dépense');
    error.statusCode = 403;
    throw error;
  }

  const { label, amount, category, date, description } = data;

  await expense.update({
    label: label !== undefined ? label : expense.label,
    amount: amount !== undefined ? Number(amount) : expense.amount,
    category: category !== undefined ? category : expense.category,
    date: date !== undefined ? date : expense.date,
    description: description !== undefined ? description : expense.description,
  });

  return expense;
};

/**
 * Supprime une dépense (Propriétaire uniquement).
 */
export const deleteExpenseById = async (expenseId, user) => {
  const expense = await Expense.findByPk(expenseId, {
    include: [{ model: Project }],
  });

  if (!expense) {
    const error = new Error('Dépense non trouvée');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = user.role === 'CHEF_DE_PROJET' && expense.Project && expense.Project.ownerId === user.id;
  if (!isOwner) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut supprimer cette dépense');
    error.statusCode = 403;
    throw error;
  }

  await expense.destroy();
  return { message: 'Dépense supprimée avec succès' };
};
