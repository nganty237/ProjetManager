import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import sequelize from './config/db.js';
import { initAdminAccount } from './utils/seedAdmin.js';

dotenv.config();

/**
 * Script de synchronisation de la base de données et d'initialisation du compte administrateur.
 */
const syncDatabase = async () => {
  try {
    console.log('Connexion à la base de données MySQL...');
    await connectDB();
    await sequelize.sync({ alter: true });

    console.log('\n========================================');
    console.log('Base de données synchronisée avec succès !');
    console.log('========================================\n');

    // Initialisation automatique du compte Administrateur
    await initAdminAccount();

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la synchronisation :', error);
    process.exit(1);
  }
};

syncDatabase();