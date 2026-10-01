import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Expense from '../models/Expense.js';

const defaultInclude = [
  { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'avatar', 'role'] },
  { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
  {
    model: Task,
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }],
  },
  { model: Expense, as: 'expenses' },
];

/**
 * Récupère les projets selon le rôle et les autorisations de l'utilisateur.
 */
export const findProjectsByUser = async (user) => {
  let whereClause = {};

  if (user.role === 'CHEF_DE_PROJET') {
    whereClause = { ownerId: user.id };
  }

  const projects = await Project.findAll({
    where: whereClause,
    include: defaultInclude,
    order: [['updatedAt', 'DESC']],
  });

  if (user.role === 'MEMBRE') {
    return projects.filter(
      (project) => project.members && project.members.some((m) => m.id === user.id)
    );
  }

  return projects;
};

/**
 * Récupère un projet spécifique avec vérification des droits d'accès.
 */
export const findProjectById = async (projectId, user) => {
  const project = await Project.findByPk(projectId, {
    include: defaultInclude,
  });

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
    const isMember = project.members && project.members.some((m) => m.id === user.id);
    if (!isMember) {
      const error = new Error("Accès refusé : vous ne faites pas partie de ce projet");
      error.statusCode = 403;
      throw error;
    }
  }

  return project;
};

/**
 * Crée un nouveau projet (Chef de projet uniquement).
 */
export const createNewProject = async (data, user) => {
  if (user.role !== 'CHEF_DE_PROJET') {
    const error = new Error('Seul un chef de projet peut créer un nouveau projet');
    error.statusCode = 403;
    throw error;
  }

  const { title, description, status, priority, startDate, endDate, teamIds, budgetAllocated } = data;

  const project = await Project.create({
    title,
    description,
    status: status || 'active',
    priority: priority || 'medium',
    startDate: startDate || new Date(),
    endDate,
    budgetAllocated: budgetAllocated ? Number(budgetAllocated) : 0,
    ownerId: user.id,
  });

  if (teamIds && teamIds.length > 0) {
    await project.addMembers(teamIds);
  }

  return await Project.findByPk(project.id, {
    include: defaultInclude,
  });
};

/**
 * Met à jour un projet existant (Propriétaire uniquement).
 */
export const updateExistingProject = async (projectId, data, user) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    const error = new Error('Projet non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (project.ownerId !== user.id) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut modifier ce projet');
    error.statusCode = 403;
    throw error;
  }

  const { teamIds, budgetAllocated, ...projectData } = data;

  if (budgetAllocated !== undefined) {
    projectData.budgetAllocated = Number(budgetAllocated) || 0;
  }

  await project.update(projectData);

  if (teamIds) {
    await project.setMembers(teamIds);
  }

  return await Project.findByPk(project.id, {
    include: defaultInclude,
  });
};

/**
 * Met à jour le budget alloué d'un projet (Propriétaire uniquement).
 */
export const updateProjectBudgetAmount = async (projectId, allocated, user) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    const error = new Error('Projet non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (project.ownerId !== user.id) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut modifier le budget');
    error.statusCode = 403;
    throw error;
  }

  const budgetAllocated = Number(allocated) || 0;
  await project.update({ budgetAllocated });

  return { id: project.id, budgetAllocated, budget: { allocated: budgetAllocated } };
};

/**
 * Supprime un projet (Propriétaire uniquement).
 */
export const deleteProjectById = async (projectId, user) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    const error = new Error('Projet non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (project.ownerId !== user.id) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut supprimer ce projet');
    error.statusCode = 403;
    throw error;
  }

  await project.destroy();
  return { message: 'Projet supprimé' };
};
