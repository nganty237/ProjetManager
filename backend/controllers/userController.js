import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';

// Récupérer tous les utilisateurs (pour l'équipe et l'administration)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'avatar', 'role', 'status', 'createdAt', 'invitationExpiresAt'],
    include: [
      { model: Project, as: 'projects', attributes: ['id'] },
      { model: Task, attributes: ['id', 'status'] }
    ],
    order: [['createdAt', 'DESC']],
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

// Créer un compte utilisateur par l'administrateur (génère un token d'invitation)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    res.status(400);
    throw new Error("Veuillez renseigner le nom, l'email et le rôle");
  }

  const validRoles = ['ADMINISTRATEUR', 'CHEF_DE_PROJET', 'MEMBRE'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error("Rôle invalide. Choisissez ADMINISTRATEUR, CHEF_DE_PROJET ou MEMBRE.");
  }

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error("Cet email est déjà utilisé par un autre compte");
  }

  // Génération du token d'invitation (32 octets hex) valable 7 jours
  const invitationToken = crypto.randomBytes(32).toString('hex');
  const invitationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    role,
    status: 'EN_ATTENTE',
    password: null,
    invitationToken,
    invitationExpiresAt,
  });

  // Construction du lien d'activation (pour simulation)
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const invitationLink = `${clientUrl}/activate/${invitationToken}`;

  console.log(`\n========================================`);
  console.log(`📧 [SIMULATION EMAIL INVITATION]`);
  console.log(`Destinataire : ${user.email} (${user.name})`);
  console.log(`Rôle attribué : ${user.role}`);
  console.log(`Lien d'activation : ${invitationLink}`);
  console.log(`========================================\n`);

  res.status(201).json({
    message: "Compte utilisateur créé avec succès en attente d'activation",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
    invitationLink,
    invitationToken,
  });
});

// Renvoyer une invitation (Admin seulement)
export const resendInvitation = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  if (user.status !== 'EN_ATTENTE') {
    res.status(400);
    throw new Error("Ce compte a déjà été activé");
  }

  // Nouveau token valable 7 jours
  const invitationToken = crypto.randomBytes(32).toString('hex');
  const invitationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  user.invitationToken = invitationToken;
  user.invitationExpiresAt = invitationExpiresAt;
  await user.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const invitationLink = `${clientUrl}/activate/${invitationToken}`;

  console.log(`\n========================================`);
  console.log(`📧 [SIMULATION RENVOI INVITATION]`);
  console.log(`Destinataire : ${user.email} (${user.name})`);
  console.log(`Nouveau lien d'activation : ${invitationLink}`);
  console.log(`========================================\n`);

  res.json({
    message: `Invitation renvoyée avec succès pour ${user.name}`,
    invitationLink,
    invitationToken,
  });
});

// Activer / Désactiver un compte (Admin seulement)
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  if (user.id === req.user.id) {
    res.status(400);
    throw new Error("Vous ne pouvez pas désactiver votre propre compte administrateur");
  }

  if (user.status === 'EN_ATTENTE') {
    res.status(400);
    throw new Error("Ce compte est en attente d'activation. Veuillez renvoyer une invitation au lieu de le modifier.");
  }

  const newStatus = user.status === 'ACTIF' ? 'INACTIF' : 'ACTIF';
  user.status = newStatus;
  await user.save();

  res.json({
    message: `Compte de ${user.name} passé à ${newStatus}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }
  });
});

// Modifier les informations d'un utilisateur par l'administrateur
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      res.status(400);
      throw new Error("Cet email est déjà utilisé par un autre compte");
    }
    user.email = email;
  }

  if (name) user.name = name;

  if (role) {
    const validRoles = ['ADMINISTRATEUR', 'CHEF_DE_PROJET', 'MEMBRE'];
    if (!validRoles.includes(role)) {
      res.status(400);
      throw new Error("Rôle invalide.");
    }
    if (user.id === req.user.id && role !== 'ADMINISTRATEUR') {
      res.status(400);
      throw new Error("Vous ne pouvez pas retirer votre propre rôle d'administrateur");
    }
    user.role = role;
  }

  await user.save();

  res.json({
    message: "Informations de l'utilisateur mises à jour",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    }
  });
});

// Mettre à jour le profil de l'utilisateur connecté
export const updateMe = asyncHandler(async (req, res) => {
  const { email, avatar, name } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }
  
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      res.status(400);
      throw new Error("Cet email est déjà utilisé.");
    }
    user.email = email;
  }

  if (name) {
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
    status: user.status,
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

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("Le nouveau mot de passe doit comporter au moins 6 caractères");
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
  const validRoles = ['ADMINISTRATEUR', 'CHEF_DE_PROJET', 'MEMBRE'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error('Rôle invalide. Choisissez ADMINISTRATEUR, CHEF_DE_PROJET ou MEMBRE.');
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  if (user.id === req.user.id && role !== 'ADMINISTRATEUR') {
    res.status(400);
    throw new Error("Vous ne pouvez pas retirer votre propre rôle d'administrateur");
  }

  user.role = role;
  await user.save();
  res.json({ message: `Rôle mis à jour : ${user.name} est maintenant ${role}`, user: {
    id: user.id, name: user.name, email: user.email, role: user.role, status: user.status
  }});
});

// Supprimer définitivement un utilisateur (Admin seulement)
export const deleteUser = asyncHandler(async (req, res) => {
  const userToDelete = await User.findByPk(req.params.id);
  
  if (!userToDelete) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  if (userToDelete.id === req.user.id) {
    res.status(403);
    throw new Error("Action non autorisée. Vous ne pouvez pas supprimer votre propre compte.");
  }

  // L'administrateur ne peut pas supprimer un autre administrateur
  if (userToDelete.role === 'ADMINISTRATEUR') {
    res.status(403);
    throw new Error("Action non autorisée. Vous ne pouvez pas supprimer un autre administrateur.");
  }

  await userToDelete.destroy();
  res.json({ message: "Utilisateur supprimé avec succès." });
});
