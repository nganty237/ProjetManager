import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log('--- Database Connection Test ---');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Port: 3306`);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  connectTimeout: 30000
});

connection.connect((err) => {
  if (err) {
    console.error('Connection failed with error:');
    console.error('Code:', err.code);
    console.error('Errno:', err.errno);
    console.error('SQL State:', err.sqlState);
    console.error('Message:', err.message);
    process.exit(1);
  } else {
    console.log('Successfully connected to MySQL!');
    connection.query('SELECT 1 + 1 AS solution', (error, results) => {
      if (error) {
        console.error('Query failed:', error);
      } else {
        console.log('Query successful, solution is:', results[0].solution);
      }
      connection.end();
      process.exit(0);
    });
  }
});

// Timeout safeguard
setTimeout(() => {
  console.log('Script timed out after 40 seconds');
  process.exit(1);
}, 40000);
