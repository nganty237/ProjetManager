import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

// Récupérer tous les projets avec leurs membres et tâches
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.findAll({
    include: [
      { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
      { model: Task }
    ],
    order: [['updatedAt', 'DESC']]
  });
  res.json(projects);
});

// Récupérer un projet spécifique par son ID
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id, {
    include: [
      { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
      { model: Task }
    ]
  });
  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error("Projet non trouvé");
  }
});

// Créer un nouveau projet
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, status, priority, startDate, endDate, teamIds } = req.body;

  const project = await Project.create({
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
  });

  // Ajouter les membres à l'équipe (table de jointure TeamMembers)
  if (teamIds && teamIds.length > 0) {
    await project.addMembers(teamIds);
  }

  // Récupérer le projet créé avec ses membres
  const createdProject = await Project.findByPk(project.id, {
    include: [{ model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] }]
  });

  res.status(201).json(createdProject);
});

// Mettre à jour un projet
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Projet non trouvé");
  }

  const { teamIds, ...projectData } = req.body;
  await project.update(projectData);

  // Mettre à jour l'équipe si nécessaire
  if (teamIds) {
    await project.setMembers(teamIds);
  }

  res.json(project);
});

// Supprimer un projet
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Projet non trouvé");
  }

  await project.destroy();
  res.json({ message: "Projet supprimé" });
});
