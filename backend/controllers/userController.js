import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import bcrypt from 'bcryptjs';
import asyncHandler from '../utils/asyncHandler.js';

// Récupérer tous les utilisateurs (pour l'équipe)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'avatar', 'role'],
    include: [
      { model: Project, as: 'projects', attributes: ['id'] },
      { model: Task, attributes: ['id', 'status'] }
    ]
  });
  res.json(users);
});

// Récupérer le profil de l'utilisateur connecté
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    include: [
      { model: Project, as: 'projects', attributes: ['id', 'title', 'status'] },
      { model: Task, attributes: ['id', 'title', 'status'] }
    ]
  });
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
  res.json(user);
});

// Mettre à jour le profil de l'utilisateur connecté
export const updateMe = asyncHandler(async (req, res) => {
  const { email, avatar, name } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
  
  // Check if new email is already in use
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      res.status(400);
      throw new Error("Cet email est déjà utilisé.");
    }
    user.email = email;
  }

  // Seul l'administrateur peut changer son nom
  if (name && user.role === 'Administrateur') {
    user.name = name;
  }
  
  if (avatar) user.avatar = avatar;
  
  if (req.file) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    user.avatar = `${baseUrl}/uploads/${req.file.filename}`;
  }
  await user.save();
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  });
});

// Changer le mot de passe
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier le mot de passe actuel
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Le mot de passe actuel est incorrect.");
  }

  // Hacher et enregistrer le nouveau
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ message: "Mot de passe mis à jour avec succès" });
});

// Changer le rôle d'un utilisateur (Admin seulement)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['Administrateur', 'Membre'].includes(role)) {
    res.status(400);
    throw new Error('Rôle invalide. Choisissez Administrateur ou Membre.');
  }
  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
  user.role = role;
  await user.save();
  res.json({ message: `Rôle mis à jour : ${user.name} est maintenant ${role}`, user: {
    id: user.id, name: user.name, email: user.email, role: user.role
  }});
});

// Supprimer un utilisateur (Admin seulement)
export const deleteUser = asyncHandler(async (req, res) => {
  const userToDelete = await User.findByPk(req.params.id);
  
  if (!userToDelete) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  // L'administrateur ne peut pas supprimer un autre administrateur
  if (userToDelete.role === 'Administrateur') {
    res.status(403);
    throw new Error("Action non autorisée. Vous ne pouvez pas supprimer un autre administrateur.");
  }

  await userToDelete.destroy();
  res.json({ message: "Membre supprimé avec succès." });
});
