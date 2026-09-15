import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { sequelize } from './models/index.js';
import { initAdminAccount } from './utils/seedAdmin.js';

dotenv.config();

/**
 * Script de réinitialisation complète de la base de données :
 * 1. Désactive temporairement les clés étrangères.
 * 2. Supprime et recrée toutes les tables à neuf (force: true).
 * 3. Réactive les clés étrangères.
 * 4. Recrée automatiquement le compte Administrateur initial (défini dans .env).
 */
const resetDatabase = async () => {
  try {
    console.log('Connexion à MySQL...');
    await connectDB();

    console.log('Désactivation temporaire des contraintes de clés étrangères...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    console.log('Suppression et recréation de toutes les tables à neuf...');
    await sequelize.sync({ force: true });

    console.log('Réactivation des contraintes de clés étrangères...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('\n=============================================================');
    console.log('✅ Base de données entièrement vidée et réinitialisée !');
    console.log('=============================================================\n');

    // Recréation du compte Administrateur initial
    await initAdminAccount();

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation de la base de données :', error);
    process.exit(1);
  }
};

resetDatabase();
