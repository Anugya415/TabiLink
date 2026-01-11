import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import sequelize from '../config/database';
import '../models'; // Import models to initialize associations

dotenv.config();

const createDatabaseIfNotExists = async (): Promise<void> => {
  const dbName = process.env.DB_NAME || 'tabilink';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '3306');
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';

  // Create connection without specifying database
  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database '${dbName}' created or already exists`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

const syncDatabase = async (): Promise<void> => {
  try {
    // Sync all models (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('Database tables synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

const initDatabase = async (): Promise<void> => {
  try {
    console.log('Initializing database...');
    
    // Step 1: Create database if not exists
    await createDatabaseIfNotExists();
    
    // Step 2: Connect to the database and sync models (create tables)
    await sequelize.authenticate();
    console.log('MySQL Connected successfully');
    
    // Step 3: Sync all models to create tables
    await syncDatabase();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

export default initDatabase;

// Run if executed directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}









