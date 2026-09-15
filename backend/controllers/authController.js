import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Génère un token JWT pour un utilisateur donné.
 */
const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });



// Vérifier la validité d'un token d'invitation (utilisé par la page d'activation)
export const verifyInvitation = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    res.status(400);
    throw new Error("Token d'invitation manquant");
  }

  const user = await User.findOne({
    where: { invitationToken: token },
    attributes: ['id', 'name', 'email', 'role', 'status', 'invitationExpiresAt']
  });

  if (!user) {
    res.status(404);
    throw new Error("Lien d'invitation invalide ou expiré");
  }

  if (user.status !== 'EN_ATTENTE') {
    res.status(400);
    throw new Error("Ce compte a déjà été activé");
  }

  if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
    res.status(400);
    throw new Error("Ce lien d'invitation a expiré. Veuillez demander un renvoi à l'administrateur.");
  }

  res.json({
    valid: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

// Activer le compte avec un nouveau mot de passe
export const activateAccount = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error("Token et mot de passe requis");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Le mot de passe doit contenir au moins 6 caractères");
  }

  const user = await User.findOne({ where: { invitationToken: token } });

  if (!user) {
    res.status(404);
    throw new Error("Lien d'invitation invalide ou expiré");
  }

  if (user.status !== 'EN_ATTENTE') {
    res.status(400);
    throw new Error("Ce compte a déjà été activé");
  }

  if (user.invitationExpiresAt && new Date(user.invitationExpiresAt) < new Date()) {
    res.status(400);
    throw new Error("Ce lien d'invitation a expiré. Veuillez demander un renvoi à l'administrateur.");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.status = 'ACTIF';
  user.invitationToken = null;
  user.invitationExpiresAt = null;
  await user.save();

  res.json({ message: "Compte activé avec succès ! Vous pouvez maintenant vous connecter." });
});

// Connexion d'un utilisateur
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Veuillez fournir un email et un mot de passe");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    res.status(400);
    throw new Error("Identifiants invalides");
  }

  // Vérification du statut du compte
  if (user.status === 'EN_ATTENTE') {
    res.status(403);
    throw new Error("Votre compte est en attente d'activation. Veuillez utiliser le lien d'invitation reçu pour définir votre mot de passe.");
  }

  if (user.status === 'INACTIF') {
    res.status(403);
    throw new Error("Votre compte a été désactivé par l'administrateur.");
  }

  if (!user.password) {
    res.status(400);
    throw new Error("Ce compte n'a pas de mot de passe configuré. Veuillez utiliser votre lien d'invitation.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Identifiants invalides");
  }

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar
    }
  });
});
