import sequelize from '../config/db.js';
import User from './User.js';
import Project from './Project.js';
import Task from './Task.js';
import Expense from './Expense.js';

// Multi-table relations (Sequelize Associations)
Project.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(Project);

Project.hasMany(Expense, { onDelete: 'CASCADE', as: 'expenses' });
Expense.belongsTo(Project);

// Project ownership (Chef de projet)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Project.belongsToMany(User, { through: 'TeamMembers', as: 'members' });
User.belongsToMany(Project, { through: 'TeamMembers', as: 'projects' });

User.hasMany(Task, { foreignKey: 'assignedToId' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });

export { sequelize, User, Project, Task, Expense };
