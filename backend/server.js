import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize, { connectDB } from './config/db.js';

// Import des modèles
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Définition des relations (Associations Sequelize)
Project.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(Project);

Project.belongsToMany(User, { through: 'TeamMembers', as: 'members' });
User.belongsToMany(Project, { through: 'TeamMembers', as: 'projects' });

User.hasMany(Task, { foreignKey: 'assignedToId' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: "API PROJET MANAGER - MySQL Edition" });
});

// Lancement
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('Tables MySQL synchronisées.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur :', error.message);
  }
};

startServer();
