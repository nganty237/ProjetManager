import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modèle Utilisateur représentant les comptes de la plateforme.
 * 
 * Rôles gérés :
 * - ADMINISTRATEUR : gestion de la plateforme, utilisateurs, et supervision
 * - CHEF_DE_PROJET : gestion complète de ses propres projets (ownerId)
 * - MEMBRE         : exécution des tâches assignées
 * 
 * Statuts gérés :
 * - EN_ATTENTE : compte invité par l'admin, en attente de mot de passe via token
 * - ACTIF      : compte activé et autorisé à naviguer
 * - INACTIF    : compte suspendu/désactivé par l'administrateur
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('ADMINISTRATEUR', 'CHEF_DE_PROJET', 'MEMBRE'),
    defaultValue: 'MEMBRE',
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('EN_ATTENTE', 'ACTIF', 'INACTIF'),
    defaultValue: 'EN_ATTENTE',
    allowNull: false,
  },
  invitationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  invitationExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
