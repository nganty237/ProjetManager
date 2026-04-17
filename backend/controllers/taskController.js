import Task from '../models/Task.js';
import User from '../models/User.js';

// Ajouter une tâche à un projet
export const createTask = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une tâche (ex: changer le statut)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

    await task.update(req.body);
    
    const updatedTask = await Task.findByPk(task.id, {
      include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'avatar'] }]
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une tâche
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

    await task.destroy();
    res.json({ message: "Tâche supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
