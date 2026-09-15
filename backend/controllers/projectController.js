import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Expense from '../models/Expense.js';
import asyncHandler from '../utils/asyncHandler.js';

// Récupérer les projets selon le rôle de l'utilisateur
// - ADMINISTRATEUR : tous les projets (lecture seule de supervision)
// - CHEF_DE_PROJET : uniquement ses propres projets (ownerId)
// - MEMBRE : uniquement les projets où il est affecté
export const getProjects = asyncHandler(async (req, res) => {
  let whereClause = {};

  if (req.user.role === 'CHEF_DE_PROJET') {
    whereClause = { ownerId: req.user.id };
  }

  const includeClause = [
    { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'avatar', 'role'] },
    { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
    {
      model: Task,
      include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }],
    },
    { model: Expense, as: 'expenses' },
  ];

  // Si c'est un membre, on filtre pour ne renvoyer que les projets où il est membre
  if (req.user.role === 'MEMBRE') {
    const projects = await Project.findAll({
      include: includeClause,
      order: [['updatedAt', 'DESC']],
    });
    // Filtrer pour les membres
    const memberProjects = projects.filter(project => 
      project.members && project.members.some(m => m.id === req.user.id)
    );
    return res.json(memberProjects);
  }

  const projects = await Project.findAll({
    where: whereClause,
    include: includeClause,
    order: [['updatedAt', 'DESC']],
  });

  res.json(projects);
});

// Récupérer un projet spécifique par son ID
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'avatar', 'role'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
      {
        model: Task,
        include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }],
      },
      { model: Expense, as: 'expenses' },
    ],
  });

  if (!project) {
    res.status(404);
    throw new Error("Projet non trouvé");
  }

  // Vérification des accès
  if (req.user.role === 'CHEF_DE_PROJET' && project.ownerId !== req.user.id) {
    res.status(403);
    throw new Error("Accès refusé : vous n'êtes pas le propriétaire de ce projet");
  }

  if (req.user.role === 'MEMBRE') {
    const isMember = project.members && project.members.some(m => m.id === req.user.id);
    if (!isMember) {
      res.status(403);
      throw new Error("Accès refusé : vous ne faites pas partie de ce projet");
    }
  }

  res.json(project);
});

// Créer un nouveau projet (Chef de projet uniquement)
export const createProject = asyncHandler(async (req, res) => {
  if (req.user.role !== 'CHEF_DE_PROJET') {
    res.status(403);
    throw new Error("Seul un chef de projet peut créer un nouveau projet");
  }

  const { title, description, status, priority, startDate, endDate, teamIds, budgetAllocated } = req.body;

  const project = await Project.create({
    title,
    description,
    status: status || 'active',
    priority: priority || 'medium',
    startDate: startDate || new Date(),
    endDate,
    budgetAllocated: budgetAllocated ? Number(budgetAllocated) : 0,
    ownerId: req.user.id, // Le chef de projet connecté devient propriétaire
  });

  // Ajouter les membres à l'équipe (table de jointure TeamMembers)
  if (teamIds && teamIds.length > 0) {
    await project.addMembers(teamIds);
  }

  // Récupérer le projet créé avec ses associations
  const createdProject = await Project.findByPk(project.id, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'avatar', 'role'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
      {
        model: Task,
        include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }],
      },
      { model: Expense, as: 'expenses' },
    ],
  });

  res.status(201).json(createdProject);
});

// Mettre à jour un projet (Propriétaire uniquement)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Projet non trouvé");
  }

  // Seul le propriétaire chef de projet peut modifier
  if (project.ownerId !== req.user.id) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut modifier ce projet");
  }

  const { teamIds, budgetAllocated, ...projectData } = req.body;
  
  if (budgetAllocated !== undefined) {
    projectData.budgetAllocated = Number(budgetAllocated) || 0;
  }

  await project.update(projectData);

  // Mettre à jour l'équipe si fournie
  if (teamIds) {
    await project.setMembers(teamIds);
  }

  // Récupérer le projet à jour
  const updatedProject = await Project.findByPk(project.id, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'avatar', 'role'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
      {
        model: Task,
        include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }],
      },
      { model: Expense, as: 'expenses' },
    ],
  });

  res.json(updatedProject);
});

// Mettre à jour spécifiquement le budget alloué d'un projet (Propriétaire uniquement)
export const updateProjectBudget = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Projet non trouvé");
  }

  if (project.ownerId !== req.user.id) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut modifier le budget");
  }

  const { allocated } = req.body;
  const budgetAllocated = Number(allocated) || 0;

  await project.update({ budgetAllocated });

  res.json({ id: project.id, budgetAllocated, budget: { allocated: budgetAllocated } });
});

// Supprimer un projet (Propriétaire uniquement)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Projet non trouvé");
  }

  if (project.ownerId !== req.user.id) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut supprimer ce projet");
  }

  await project.destroy();
  res.json({ message: "Projet supprimé" });
});
