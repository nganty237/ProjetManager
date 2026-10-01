import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import config from './index.js';
import logger from '../utils/logger.js';

const log = logger.for('Database');

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: config.db.logging ? (msg) => log.debug(msg) : false,
    define: {
      timestamps: true,
    },
    pool: config.db.pool,
    dialectOptions: {
      connectTimeout: config.db.connectTimeout,
    },
  }
);

/**
 * Fonction d'attente pour les retentatives de connexion
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Initialise et connecte la base de données MySQL avec gestion des retentatives.
 */
export const connectDB = async () => {
  const { host, port, user, password, name: dbName, retryAttempts, retryDelayMs } = config.db;
  let attempt = 0;

  while (attempt < retryAttempts) {
    attempt++;
    try {
      log.info(`Connecting to MySQL on ${host}:${port} (attempt ${attempt}/${retryAttempts})...`);

      // Étape 1 : Connexion au serveur MySQL pour vérifier/créer la base
      const connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
      });

      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
      );
      await connection.end();

      // Étape 2 : Authentification Sequelize avec la base de données
      await sequelize.authenticate();
      log.info(`Connected successfully to database "${dbName}" (${host}:${port})`);

      // Étape 3 : Nettoyer les index dupliqués
      await cleanDuplicateIndexes();
      return true;
    } catch (error) {
      log.warn(`Connection attempt ${attempt}/${retryAttempts} failed: ${error.message}`);

      if (error.code === 'ECONNREFUSED') {
        log.error(
          `MySQL service is unreachable at ${host}:${port}. Please verify that the MySQL service is started and listening.`
        );
      }

      if (attempt < retryAttempts) {
        log.info(`Retrying in ${retryDelayMs / 1000} second(s)...`);
        await wait(retryDelayMs);
      } else {
        log.error(`Unable to connect to MySQL database after ${retryAttempts} attempts.`);
        throw error;
      }
    }
  }
};

/**
 * Nettoie les index uniques dupliqués générés automatiquement par Sequelize (email_2, email_3...)
 */
export const cleanDuplicateIndexes = async () => {
  try {
    const [indexes] = await sequelize.query('SHOW INDEX FROM Users');
    if (!Array.isArray(indexes)) return;

    const duplicates = [...new Set(indexes.map((r) => r.Key_name))].filter(
      (k) => k && k.startsWith('email_') && k !== 'email'
    );

    for (const key of duplicates) {
      await sequelize.query(`ALTER TABLE Users DROP INDEX \`${key}\``);
      log.debug(`Duplicate index removed: ${key}`);
    }
  } catch {
    // Si la table Users n'existe pas encore lors du premier lancement, on ignore silencieusement
  }
};

export default sequelize;
