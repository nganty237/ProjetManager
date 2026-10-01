import asyncHandler from '../utils/asyncHandler.js';
import * as taskService from '../services/taskService.js';

// Ajouter une tâche à un projet
export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTaskForProject(req.params.projectId, req.body, req.user);
  res.status(201).json(task);
});

// Mettre à jour une tâche
export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTaskById(req.params.taskId, req.body, req.user);
  res.json(task);
});

// Supprimer une tâche
export const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTaskById(req.params.taskId, req.user);
  res.json(result);
});
