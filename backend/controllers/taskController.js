import Task from '../models/Task.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Ajouter une tâche à un projet
export const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, priority, dueDate, assignedToId } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    ProjectId: projectId,
    assignedToId
  });

  const createdTask = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar'] }]
  });

  res.status(201).json(createdTask);
});

// Mettre à jour une tâche (ex: changer le statut)
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error("Tâche non trouvée");
  }

  await task.update(req.body);
  
  const updatedTask = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar'] }]
  });

  res.json(updatedTask);
});

// Supprimer une tâche
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.taskId);
  if (!task) {
    res.status(404);
    throw new Error("Tâche non trouvée");
  }

  await task.destroy();
  res.json({ message: "Tâche supprimée" });
});
