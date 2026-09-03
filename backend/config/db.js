import { Sequelize } from 'sequelize';
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

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connecté via Sequelize !');
  } catch (error) {
    console.error('Erreur de connexion MySQL :', error);
    process.exit(1);
  }
};

export default sequelize;
