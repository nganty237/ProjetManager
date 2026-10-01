import { connectDB, sequelize } from './config/db.js';
import { initAdminAccount } from './utils/seedAdmin.js';
import logger from './utils/logger.js';

const log = logger.for('Seeder');

/**
 * Script d'initialisation propre : vérifie la connexion et assure la création du compte administrateur.
 * Ne contient aucune donnée factice ou de démonstration.
 */
export const seedDatabase = async () => {
  try {
    log.info('Connecting to database...');
    await connectDB();
    await sequelize.sync();

    // Initialisation du compte Administrateur si inexistant
    await initAdminAccount();

    log.info('Database initialized successfully.');
  } catch (error) {
    log.error(`Database initialization failed: ${error.message}`, error);
    throw error;
  }
};

// Exécution directe via script CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedDatabase;