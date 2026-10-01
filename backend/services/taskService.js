import Task from '../models/Task.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

/**
 * Crée une tâche associée à un projet.
 */
export const createTaskForProject = async (projectId, data, user) => {
  const { title, description, status, priority, dueDate } = data;

  const project = await Project.findByPk(projectId);
  if (!project) {
    const error = new Error('Projet non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'CHEF_DE_PROJET' || project.ownerId !== user.id) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut créer des tâches');
    error.statusCode = 403;
    throw error;
  }

  let assignedToId = data.assignedToId;
  if (!assignedToId && data.assignedTo?.id) {
    assignedToId = data.assignedTo.id;
  }
  assignedToId =
    assignedToId && typeof assignedToId === 'string' && assignedToId.trim() !== ''
      ? assignedToId.trim()
      : null;

  const task = await Task.create({
    title,
    description,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    ProjectId: projectId,
    assignedToId,
  });

  const createdTask = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }],
  });

  const taskData = createdTask.toJSON();
  taskData.assignedTo = taskData.assignee;
  return taskData;
};

/**
 * Met à jour une tâche selon les droits (propriétaire ou membre assigné).
 */
export const updateTaskById = async (taskId, data, user) => {
  const task = await Task.findByPk(taskId, {
    include: [{ model: Project }],
  });

  if (!task) {
    const error = new Error('Tâche non trouvée');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = user.role === 'CHEF_DE_PROJET' && task.Project && task.Project.ownerId === user.id;
  const isAssignee = task.assignedToId && task.assignedToId.toString() === user.id.toString();

  if (!isOwner && !isAssignee) {
    const error = new Error(
      'Accès refusé : seul le chef de projet propriétaire ou la personne assignée peut modifier cette tâche'
    );
    error.statusCode = 403;
    throw error;
  }

  if (!isOwner && isAssignee) {
    // Le membre assigné ne peut modifier que le statut de sa tâche
    if (data.status) {
      task.status = data.status;
      await task.save();
    }
  } else {
    // Le chef propriétaire peut tout modifier
    const updateData = { ...data };
    if ('assignedToId' in updateData || 'assignedTo' in updateData) {
      let assignedToId = updateData.assignedToId;
      if (!assignedToId && updateData.assignedTo?.id) {
        assignedToId = updateData.assignedTo.id;
      }
      updateData.assignedToId =
        assignedToId && typeof assignedToId === 'string' && assignedToId.trim() !== ''
          ? assignedToId.trim()
          : null;
    }
    delete updateData.assignedTo;
    await task.update(updateData);
  }

  const updatedTask = await Task.findByPk(task.id, {
    include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar', 'role'] }],
  });

  const taskData = updatedTask.toJSON();
  taskData.assignedTo = taskData.assignee;
  return taskData;
};

/**
 * Supprime une tâche (Chef de projet propriétaire uniquement).
 */
export const deleteTaskById = async (taskId, user) => {
  const task = await Task.findByPk(taskId, {
    include: [{ model: Project }],
  });

  if (!task) {
    const error = new Error('Tâche non trouvée');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = user.role === 'CHEF_DE_PROJET' && task.Project && task.Project.ownerId === user.id;
  if (!isOwner) {
    const error = new Error('Accès refusé : seul le chef de projet propriétaire peut supprimer cette tâche');
    error.statusCode = 403;
    throw error;
  }

  await task.destroy();
  return { message: 'Tâche supprimée' };
};
