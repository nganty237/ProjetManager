import asyncHandler from '../utils/asyncHandler.js';
import * as userService from '../services/userService.js';

// Récupérer tous les utilisateurs
export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.findAllUsers();
  res.json(users);
});

// Récupérer le profil de l'utilisateur connecté
export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.findUserProfile(req.user.id);
  res.json(user);
});

// Créer un compte utilisateur par l'administrateur
export const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUserByAdmin(req.body);
  res.status(201).json(result);
});

// Renvoyer une invitation (Admin seulement)
export const resendInvitation = asyncHandler(async (req, res) => {
  const result = await userService.resendUserInvitation(req.params.id);
  res.json(result);
});

// Activer / Désactiver un compte (Admin seulement)
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const result = await userService.toggleUserActiveStatus(req.params.id, req.user.id);
  res.json(result);
});

// Modifier les informations d'un utilisateur par l'administrateur
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const result = await userService.updateUserInformationByAdmin(req.params.id, req.body, req.user.id);
  res.json(result);
});

// Mettre à jour le profil de l'utilisateur connecté
export const updateMe = asyncHandler(async (req, res) => {
  const reqMeta = {
    protocol: req.protocol,
    host: req.get('host'),
  };
  const result = await userService.updateConnectedUserProfile(req.user.id, req.body, req.file, reqMeta);
  res.json(result);
});

// Changer le mot de passe
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.updateUserPassword(req.user.id, currentPassword, newPassword);
  res.json(result);
});

// Changer le rôle d'un utilisateur (Admin seulement)
export const updateUserRole = asyncHandler(async (req, res) => {
  const result = await userService.updateUserRole(req.params.id, req.body.role, req.user.id);
  res.json(result);
});

// Supprimer définitivement un utilisateur (Admin seulement)
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUserById(req.params.id, req.user.id);
  res.json(result);
});
