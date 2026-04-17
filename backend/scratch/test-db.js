import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log(`Connecting to ${process.env.DB_HOST} with user ${process.env.DB_USER}...`);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      debug: true
    });

    console.log('Successfully connected to MySQL!');
    await connection.end();
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
