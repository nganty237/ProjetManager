import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

// Récupérer tous les projets avec leurs membres et tâches
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
        { model: Task }
      ],
      order: [['updatedAt', 'DESC']]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un projet spécifique par son ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'members', attributes: ['id', 'name', 'avatar', 'role'] },
        { model: Task }
      ]
    });
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Projet non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouveau projet
export const createProject = async (req, res) => {
  try {
    const { title, description, status, priority, startDate, endDate, teamIds } = req.body;

    const project = await Project.create({
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      progress: 0
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un projet
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    const { teamIds, ...projectData } = req.body;
    await project.update(projectData);

    // Mettre à jour l'équipe si nécessaire
    if (teamIds) {
      await project.setMembers(teamIds);
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un projet
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    await project.destroy();
    res.json({ message: "Projet supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
