import asyncHandler from '../utils/asyncHandler.js';
import * as projectService from '../services/projectService.js';

// Récupérer les projets selon le rôle de l'utilisateur
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.findProjectsByUser(req.user);
  res.json(projects);
});

// Récupérer un projet spécifique par son ID
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.findProjectById(req.params.id, req.user);
  res.json(project);
});

// Créer un nouveau projet (Chef de projet uniquement)
export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createNewProject(req.body, req.user);
  res.status(201).json(project);
});

// Mettre à jour un projet (Propriétaire uniquement)
export const updateProject = asyncHandler(async (req, res) => {
  const updatedProject = await projectService.updateExistingProject(req.params.id, req.body, req.user);
  res.json(updatedProject);
});

// Mettre à jour spécifiquement le budget alloué d'un projet (Propriétaire uniquement)
export const updateProjectBudget = asyncHandler(async (req, res) => {
  const result = await projectService.updateProjectBudgetAmount(req.params.id, req.body.allocated, req.user);
  res.json(result);
});

// Supprimer un projet (Propriétaire uniquement)
export const deleteProject = asyncHandler(async (req, res) => {
  const result = await projectService.deleteProjectById(req.params.id, req.user);
  res.json(result);
});
