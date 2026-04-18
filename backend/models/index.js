import sequelize from '../config/db.js';
import User from './User.js';
import Project from './Project.js';
import Task from './Task.js';

// Multi-table relations (Sequelize Associations)
Project.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(Project);

Project.belongsToMany(User, { through: 'TeamMembers', as: 'members' });
User.belongsToMany(Project, { through: 'TeamMembers', as: 'projects' });

User.hasMany(Task, { foreignKey: 'assignedToId' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });

export { sequelize, User, Project, Task };
