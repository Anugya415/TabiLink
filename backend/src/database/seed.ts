import dotenv from 'dotenv';
import connectDB from './connection';
import User from '../models/User';
import '../models'; // Import models to initialize associations

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Create regular user
    const userExists = await User.findOne({ where: { email: 'user@tabilink.com' } });
    if (!userExists) {
      await User.create({
        name: 'John Doe',
        email: 'user@tabilink.com',
        password: process.env.USER_PASSWORD || 'user1234',
        phone: '+1234567890',
        role: 'user',
        isEmailVerified: true,
        membershipTier: 'Silver',
      } as any);
      console.log('✅ Regular user created: user@tabilink.com');
    } else {
      console.log('ℹ️  Regular user already exists: user@tabilink.com');
    }

    // Create admin user
    const adminExists = await User.findOne({ where: { email: 'admin@tabilink.com' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@tabilink.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        phone: '+1234567891',
        role: 'admin',
        isEmailVerified: true,
        membershipTier: 'Gold',
      } as any);
      console.log('✅ Admin user created: admin@tabilink.com');
    } else {
      console.log('ℹ️  Admin user already exists: admin@tabilink.com');
    }

    // Create super admin user
    const superAdminExists = await User.findOne({ where: { email: 'superadmin@tabilink.com' } });
    if (!superAdminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@tabilink.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'superadmin123',
        phone: '+1234567892',
        role: 'super_admin',
        isEmailVerified: true,
        membershipTier: 'Platinum',
      } as any);
      console.log('✅ Super admin user created: superadmin@tabilink.com');
    } else {
      console.log('ℹ️  Super admin user already exists: superadmin@tabilink.com');
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Regular User:');
    console.log('  Email: user@tabilink.com');
    console.log(`  Password: ${process.env.USER_PASSWORD || 'user1234'}`);
    console.log('  Role: user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin User:');
    console.log('  Email: admin@tabilink.com');
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('  Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin User:');
    console.log('  Email: superadmin@tabilink.com');
    console.log(`  Password: ${process.env.SUPER_ADMIN_PASSWORD || 'superadmin123'}`);
    console.log('  Role: super_admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
