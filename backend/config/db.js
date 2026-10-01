import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // On désactive les logs SQL dans la console
    define: {
      timestamps: true, // Sequelize ajoutera automatiquement createdAt et updatedAt
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

/**
 * Initialise et connecte la base de données MySQL.
 * Crée automatiquement la base de données si elle n'existe pas encore.
 */
export const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || 'project_manager';
    
    // Étape 1 : Connexion au serveur MySQL pour vérifier/créer la base
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });
    
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();

    // Étape 2 : Authentification Sequelize avec la base de données
    await sequelize.authenticate();
    console.log(`MySQL connecté avec succès à la base "${dbName}" !`);

    // Étape 3 : Nettoyer les index dupliqués (bug connu de Sequelize MySQL sur alter: true)
    await cleanDuplicateIndexes();
  } catch (error) {
    console.error('Erreur de connexion MySQL :', error);
    process.exit(1);
  }
};

/**
 * Nettoie les index uniques dupliqués générés automatiquement par Sequelize (email_2, email_3...)
 * pour éviter l'erreur MySQL 1069: Too many keys specified (max 64 keys).
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
    }
  } catch (error) {
    // Si la table Users n'existe pas encore lors du premier lancement, on ignore silencieusement
  }
};

export default sequelize;

