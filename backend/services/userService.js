import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const validRoles = ['ADMINISTRATEUR', 'CHEF_DE_PROJET', 'MEMBRE'];

/**
 * Récupère tous les utilisateurs pour l'annuaire d'équipe et l'admin.
 */
export const findAllUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'name', 'email', 'avatar', 'role', 'status', 'createdAt', 'invitationExpiresAt'],
    include: [
      { model: Project, as: 'projects', attributes: ['id'] },
      { model: Task, attributes: ['id', 'status'] },
    ],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Récupère le profil complet de l'utilisateur connecté.
 */
export const findUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    include: [
      { model: Project, as: 'projects', attributes: ['id', 'title', 'status'] },
      { model: Task, attributes: ['id', 'title', 'status'] },
    ],
  });

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Crée un compte utilisateur et génère une invitation sécurisée (Admin).
 */
export const createUserByAdmin = async (data) => {
  const { name, email, role } = data;

  if (!name || !email || !role) {
    const error = new Error("Veuillez renseigner le nom, l'email et le rôle");
    error.statusCode = 400;
    throw error;
  }

  if (!validRoles.includes(role)) {
    const error = new Error('Rôle invalide. Choisissez ADMINISTRATEUR, CHEF_DE_PROJET ou MEMBRE.');
    error.statusCode = 400;
    throw error;
  }

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    const error = new Error('Cet email est déjà utilisé par un autre compte');
    error.statusCode = 400;
    throw error;
  }

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

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const invitationLink = `${clientUrl}/activate/${invitationToken}`;

  console.log(`\n========================================`);
  console.log(`📧 [SIMULATION EMAIL INVITATION]`);
  console.log(`Destinataire : ${user.email} (${user.name})`);
  console.log(`Rôle attribué : ${user.role}`);
  console.log(`Lien d'activation : ${invitationLink}`);
  console.log(`========================================\n`);

  return {
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
  };
};

/**
 * Renvoie un nouveau lien d'invitation (Admin).
 */
export const resendUserInvitation = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (user.status !== 'EN_ATTENTE') {
    const error = new Error('Ce compte a déjà été activé');
    error.statusCode = 400;
    throw error;
  }

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

  return {
    message: `Invitation renvoyée avec succès pour ${user.name}`,
    invitationLink,
    invitationToken,
  };
};

/**
 * Bascule le statut Actif / Inactif (Admin).
 */
export const toggleUserActiveStatus = async (userId, currentUserId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (user.id === currentUserId) {
    const error = new Error('Vous ne pouvez pas désactiver votre propre compte administrateur');
    error.statusCode = 400;
    throw error;
  }

  if (user.status === 'EN_ATTENTE') {
    const error = new Error(
      "Ce compte est en attente d'activation. Veuillez renvoyer une invitation au lieu de le modifier."
    );
    error.statusCode = 400;
    throw error;
  }

  const newStatus = user.status === 'ACTIF' ? 'INACTIF' : 'ACTIF';
  user.status = newStatus;
  await user.save();

  return {
    message: `Compte de ${user.name} passé à ${newStatus}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

/**
 * Met à jour les infos d'un utilisateur par l'administrateur.
 */
export const updateUserInformationByAdmin = async (userId, data, currentUserId) => {
  const { name, email, role } = data;
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      const error = new Error('Cet email est déjà utilisé par un autre compte');
      error.statusCode = 400;
      throw error;
    }
    user.email = email;
  }

  if (name) user.name = name;

  if (role) {
    if (!validRoles.includes(role)) {
      const error = new Error('Rôle invalide.');
      error.statusCode = 400;
      throw error;
    }
    if (user.id === currentUserId && role !== 'ADMINISTRATEUR') {
      const error = new Error("Vous ne pouvez pas retirer votre propre rôle d'administrateur");
      error.statusCode = 400;
      throw error;
    }
    user.role = role;
  }

  await user.save();

  return {
    message: "Informations de l'utilisateur mises à jour",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
    },
  };
};

/**
 * Met à jour le profil de l'utilisateur connecté.
 */
export const updateConnectedUserProfile = async (userId, data, file, reqMeta) => {
  const { email, avatar, name } = data;
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      const error = new Error('Cet email est déjà utilisé.');
      error.statusCode = 400;
      throw error;
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;

  if (file && reqMeta) {
    const baseUrl = `${reqMeta.protocol}://${reqMeta.host}`;
    user.avatar = `${baseUrl}/uploads/${file.filename}`;
  }

  await user.save();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar,
  };
};

/**
 * Met à jour le mot de passe de l'utilisateur connecté.
 */
export const updateUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Le mot de passe actuel est incorrect.');
    error.statusCode = 400;
    throw error;
  }

  if (!newPassword || newPassword.length < 6) {
    const error = new Error('Le nouveau mot de passe doit comporter au moins 6 caractères');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: 'Mot de passe mis à jour avec succès' };
};

/**
 * Modifie le rôle d'un utilisateur (Admin).
 */
export const updateUserRole = async (userId, role, currentUserId) => {
  if (!validRoles.includes(role)) {
    const error = new Error('Rôle invalide. Choisissez ADMINISTRATEUR, CHEF_DE_PROJET ou MEMBRE.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (user.id === currentUserId && role !== 'ADMINISTRATEUR') {
    const error = new Error("Vous ne pouvez pas retirer votre propre rôle d'administrateur");
    error.statusCode = 400;
    throw error;
  }

  user.role = role;
  await user.save();

  return {
    message: `Rôle mis à jour : ${user.name} est maintenant ${role}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

/**
 * Supprime un utilisateur (Admin).
 */
export const deleteUserById = async (userId, currentUserId) => {
  const userToDelete = await User.findByPk(userId);

  if (!userToDelete) {
    const error = new Error('Utilisateur non trouvé');
    error.statusCode = 404;
    throw error;
  }

  if (userToDelete.id === currentUserId) {
    const error = new Error('Action non autorisée. Vous ne pouvez pas supprimer votre propre compte.');
    error.statusCode = 403;
    throw error;
  }

  if (userToDelete.role === 'ADMINISTRATEUR') {
    const error = new Error('Action non autorisée. Vous ne pouvez pas supprimer un autre administrateur.');
    error.statusCode = 403;
    throw error;
  }

  await userToDelete.destroy();
  return { message: 'Utilisateur supprimé avec succès.' };
};
