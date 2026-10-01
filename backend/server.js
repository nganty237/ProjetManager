import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './models/index.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { initAdminAccount } from './utils/seedAdmin.js';

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8080;

// Configuration CORS sécurisée (supporte une origine spécifique ou toute origine en local)
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.json({ message: "API PROJET MANAGER - MySQL Edition" });
});

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Server Initialization
const startServer = async () => {
  try {
    await connectDB();
    // Synchronisation des modèles Sequelize avec MySQL
    await sequelize.sync({ alter: true });
    console.log('Tables MySQL synchronisées.');

    // Initialisation automatique du compte Administrateur si nécessaire
    await initAdminAccount();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur :', error.message);
  }
};

startServer();
