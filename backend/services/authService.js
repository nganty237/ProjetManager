import crypto from 'crypto';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const log = logger.for('AuthService');

/**
 * Génère un token JWT pour un utilisateur donné.
 */
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Vérifie la validité d'un token d'invitation.
 */
export const verifyInvitationToken = async (token) => {
  if (!token) {
    const error = new Error("Token d'invitation manquant");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    where: { invitationToken: token },
    attributes: ['id', 'name', 'email', 'role', 'status', 'invitationExpiresAt'],
  });

  if (!user) {
    const error = new Error("Lien d'invitation invalide ou expiré");
    error.statusCode = 404;
    throw error;
  }

  if (user.status !== 'EN_ATTENTE') {
    const error = new Error("Ce compte a déjà été activé");
    error.statusCode = 400;
    throw error;
  }

  if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
    const error = new Error("Ce lien d'invitation a expiré. Veuillez demander un renvoi à l'administrateur.");
    error.statusCode = 400;
    throw error;
  }

  return {
    valid: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Active le compte avec un nouveau mot de passe.
 */
export const activateUserAccount = async (token, password) => {
  if (!token || !password) {
    const error = new Error("Token et mot de passe requis");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Le mot de passe doit contenir au moins 6 caractères");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { invitationToken: token } });

  if (!user) {
    const error = new Error("Lien d'invitation invalide ou expiré");
    error.statusCode = 404;
    throw error;
  }

  if (user.status !== 'EN_ATTENTE') {
    const error = new Error("Ce compte a déjà été activé");
    error.statusCode = 400;
    throw error;
  }

  if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
    const error = new Error("Ce lien d'invitation a expiré. Veuillez demander un renvoi à l'administrateur.");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.status = 'ACTIF';
  user.invitationToken = null;
  user.invitationExpiresAt = null;
  await user.save();

  return { message: "Compte activé avec succès ! Vous pouvez maintenant vous connecter." };
};

/**
 * Authentifie un utilisateur par email et mot de passe.
 */
export const loginUser = async (email, password) => {
  if (!email || !password) {
    const error = new Error("Veuillez fournir un email et un mot de passe");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    const error = new Error("Identifiants invalides");
    error.statusCode = 400;
    throw error;
  }

  if (user.status === 'EN_ATTENTE') {
    const error = new Error("Votre compte est en attente d'activation. Veuillez utiliser le lien d'invitation reçu pour définir votre mot de passe.");
    error.statusCode = 403;
    throw error;
  }

  if (user.status === 'INACTIF') {
    const error = new Error("Votre compte a été désactivé par l'administrateur.");
    error.statusCode = 403;
    throw error;
  }

  if (!user.password) {
    const error = new Error("Ce compte n'a pas de mot de passe configuré. Veuillez utiliser votre lien d'invitation.");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Identifiants invalides");
    error.statusCode = 400;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
    },
    token,
  };
};

/**
 * Initie la procédure de réinitialisation de mot de passe (Mot de passe oublié).
 * Sécurité : Répond toujours avec un message générique pour éviter l'énumération des comptes.
 */
export const requestPasswordReset = async (email) => {
  if (!email) {
    const error = new Error("L'adresse email est requise");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ where: { email: normalizedEmail } });

  const genericResponse = {
    message: "Si un compte actif existe avec cette adresse email, un lien de réinitialisation a été envoyé.",
  };

  // Si l'utilisateur n'existe pas ou n'est pas actif, on ne divulgue aucune information
  if (!user || user.status !== 'ACTIF') {
    log.info(`Password reset requested for non-existing or inactive email: ${normalizedEmail}`);
    return genericResponse;
  }

  // Génération d'un token aléatoire sécurisé valide 1 heure
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = resetExpiresAt;
  await user.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientUrl}/reset-password/${resetToken}`;

  log.info(`Password reset link generated: email=${user.email}, resetUrl=${resetLink}`);

  return {
    ...genericResponse,
    // En environnement de développement, on expose le lien pour faciliter les tests
    ...(process.env.NODE_ENV !== 'production' && {
      resetLink,
      resetToken,
    }),
  };
};

/**
 * Vérifie la validité d'un token de réinitialisation de mot de passe.
 */
export const verifyResetPasswordToken = async (token) => {
  if (!token) {
    const error = new Error("Token de réinitialisation manquant");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    where: { resetPasswordToken: token },
    attributes: ['id', 'name', 'email', 'status', 'resetPasswordExpiresAt'],
  });

  if (!user) {
    const error = new Error("Ce lien de réinitialisation est invalide ou a déjà été utilisé.");
    error.statusCode = 404;
    throw error;
  }

  if (user.status !== 'ACTIF') {
    const error = new Error("Ce compte utilisateur n'est pas actif.");
    error.statusCode = 403;
    throw error;
  }

  if (user.resetPasswordExpiresAt && new Date(user.resetPasswordExpiresAt) < new Date()) {
    const error = new Error("Ce lien de réinitialisation a expiré. Veuillez faire une nouvelle demande.");
    error.statusCode = 400;
    throw error;
  }

  return {
    valid: true,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

/**
 * Réinitialise le mot de passe avec le token de sécurité.
 */
export const resetPasswordWithToken = async (token, newPassword) => {
  if (!token || !newPassword) {
    const error = new Error("Token et nouveau mot de passe requis");
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error("Le mot de passe doit comporter au moins 6 caractères");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ where: { resetPasswordToken: token } });

  if (!user) {
    const error = new Error("Ce lien de réinitialisation est invalide ou a déjà été utilisé.");
    error.statusCode = 404;
    throw error;
  }

  if (user.status !== 'ACTIF') {
    const error = new Error("Ce compte utilisateur n'est pas actif.");
    error.statusCode = 403;
    throw error;
  }

  if (user.resetPasswordExpiresAt && new Date(user.resetPasswordExpiresAt) < new Date()) {
    const error = new Error("Ce lien de réinitialisation a expiré. Veuillez faire une nouvelle demande.");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordToken = null;
  user.resetPasswordExpiresAt = null;
  await user.save();

  log.info(`Password successfully reset for user: ${user.email}`);

  return { message: "Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter." };
};
