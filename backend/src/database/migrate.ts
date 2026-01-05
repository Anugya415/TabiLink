// Database migration script (placeholder)
// Add migration logic here if needed in the future

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './connection';

dotenv.config();

const migrate = async () => {
  try {
    await connectDB();
    console.log('Database migrations completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();

