import dotenv from 'dotenv';
import connectDB from './connection';
import User from '../models/User';
import '../models'; // Import models to initialize associations

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Create admin user
    const adminExists = await User.findOne({ where: { email: 'admin@tabilink.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@tabilink.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'super_admin',
        isEmailVerified: true,
        membershipTier: 'Platinum',
      } as any);
      console.log('Admin user created');
    }

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
