import Task from '../models/Task.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

// Ajouter une tâche à un projet (Chef de projet propriétaire uniquement)
export const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  const project = await Project.findByPk(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Projet non trouvé");
  }

  if (req.user.role !== 'CHEF_DE_PROJET' || project.ownerId !== req.user.id) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut créer des tâches");
  }

  let assignedToId = req.body.assignedToId;
  if (!assignedToId && req.body.assignedTo?.id) {
    assignedToId = req.body.assignedTo.id;
  }
  assignedToId = (assignedToId && typeof assignedToId === 'string' && assignedToId.trim() !== '') ? assignedToId.trim() : null;

  const task = await Task.create({
    title,
    description,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    ProjectId: projectId,
    assignedToId
  });

  const createdTask = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }]
  });

  const taskData = createdTask.toJSON();
  taskData.assignedTo = taskData.assignee;

  res.status(201).json(taskData);
});

// Mettre à jour une tâche
// - Chef de projet propriétaire : modification complète
// - Membre assigné : modification du statut uniquement
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.taskId, {
    include: [{ model: Project }]
  });

  if (!task) {
    res.status(404);
    throw new Error("Tâche non trouvée");
  }

  const isOwner = req.user.role === 'CHEF_DE_PROJET' && task.Project && task.Project.ownerId === req.user.id;
  const isAssignee = task.assignedToId && (task.assignedToId.toString() === req.user.id.toString());

  if (!isOwner && !isAssignee) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire ou la personne assignée peut modifier cette tâche");
  }

  if (!isOwner && isAssignee) {
    // Le membre assigné ne peut mettre à jour que le statut de sa tâche
    if (req.body.status) {
      task.status = req.body.status;
      await task.save();
    }
  } else {
    // Le chef propriétaire peut tout modifier
    const updateData = { ...req.body };
    if ('assignedToId' in updateData || 'assignedTo' in updateData) {
      let assignedToId = updateData.assignedToId;
      if (!assignedToId && updateData.assignedTo?.id) {
        assignedToId = updateData.assignedTo.id;
      }
      updateData.assignedToId = (assignedToId && typeof assignedToId === 'string' && assignedToId.trim() !== '') ? assignedToId.trim() : null;
    }
    delete updateData.assignedTo;
    await task.update(updateData);
  }

  const updatedTask = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }]
  });

  const taskData = updatedTask.toJSON();
  taskData.assignedTo = taskData.assignee;

  res.json(taskData);
});

// Supprimer une tâche (Chef de projet propriétaire uniquement)
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.taskId, {
    include: [{ model: Project }]
  });

  if (!task) {
    res.status(404);
    throw new Error("Tâche non trouvée");
  }

  const isOwner = req.user.role === 'CHEF_DE_PROJET' && task.Project && task.Project.ownerId === req.user.id;
  if (!isOwner) {
    res.status(403);
    throw new Error("Accès refusé : seul le chef de projet propriétaire peut supprimer cette tâche");
  }

  await task.destroy();
  res.json({ message: "Tâche supprimée" });
});
