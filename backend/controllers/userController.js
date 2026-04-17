import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

// Récupérer tous les utilisateurs (pour l'équipe)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'avatar', 'role'],
      include: [
        { model: Project, as: 'projects', attributes: ['id'] },
        { model: Task, attributes: ['id', 'status'] }
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le profil de l'utilisateur connecté
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Project, as: 'projects', attributes: ['id', 'title', 'status'] },
        { model: Task, attributes: ['id', 'title', 'status'] }
      ]
    });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le profil de l'utilisateur connecté
export const updateMe = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Changer le rôle d'un utilisateur (Admin seulement)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Administrateur', 'Membre'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Choisissez Administrateur ou Membre.' });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    user.role = role;
    await user.save();
    res.json({ message: `Rôle mis à jour : ${user.name} est maintenant ${role}`, user: {
      id: user.id, name: user.name, email: user.email, role: user.role
    }});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

