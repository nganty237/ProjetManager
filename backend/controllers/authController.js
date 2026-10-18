import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/authService.js';

// Vérifier la validité d'un token d'invitation
export const verifyInvitation = asyncHandler(async (req, res) => {
  const result = await authService.verifyInvitationToken(req.params.token);
  res.json(result);
});

// Activer le compte avec un nouveau mot de passe
export const activateAccount = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.activateUserAccount(token, password);
  res.json(result);
});

// Connexion d'un utilisateur
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json(result);
});

// Demande de réinitialisation de mot de passe (mot de passe oublié)
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.requestPasswordReset(email);
  res.json(result);
});

// Vérifier la validité d'un token de réinitialisation de mot de passe
export const verifyResetToken = asyncHandler(async (req, res) => {
  const result = await authService.verifyResetPasswordToken(req.params.token);
  res.json(result);
});

// Réinitialiser le mot de passe avec le token
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.resetPasswordWithToken(token, password);
  res.json(result);
});
