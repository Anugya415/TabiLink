import initDatabase from './init';
import dotenv from 'dotenv';

dotenv.config();

// Setup script that can be run independently
const setup = async () => {
  try {
    await initDatabase();
    console.log('\n✅ Database and tables setup completed successfully!');
    console.log('You can now run: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database setup failed:', error);
    process.exit(1);
  }
};

setup();






