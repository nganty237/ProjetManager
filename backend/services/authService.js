import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
