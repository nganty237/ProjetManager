import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

/**
 * Modèle Projet représentant un projet au sein de l'organisation.
 * 
 * Attributs clés :
 * - ownerId         : identifiant UUID du Chef de projet propriétaire et responsable
 * - budgetAllocated : enveloppe budgétaire allouée en FCFA
 * - status          : cycle de vie ('active', 'completed', 'archived')
 */
const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'archived'),
    defaultValue: 'active',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  budgetAllocated: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

export default Project;
