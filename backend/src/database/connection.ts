import sequelize from '../config/database';
import '../models'; // Import models to initialize associations

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected successfully');
    
    // Sync database (in development, set force: false in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('MySQL connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    process.exit(1);
  }
};

export default connectDB;
