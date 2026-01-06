import dotenv from 'dotenv';
import connectDB from './connection';
import User from '../models/User';
import Hotel from '../models/Hotel';
import TravelPackage from '../models/TravelPackage';
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

    // Create sample hotels
    const hotelsCount = await Hotel.count();
    if (hotelsCount === 0) {
      const sampleHotels = [
        {
          name: 'Grand Paradise Resort',
          locationCity: 'Maldives',
          locationCountry: 'Maldives',
          locationAddress: 'Paradise Island, Maldives',
          locationCoordinates: { lat: 4.1755, lng: 73.5093 },
          locationDistanceFromCenter: '2 km from city center',
          description: 'Luxurious beachfront resort with private villas and world-class amenities. Perfect for a romantic getaway or family vacation.',
          images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
          ],
          category: 'beach' as const,
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access', 'Gym'],
          price: 350.00,
          originalPrice: 450.00,
          discount: 22,
          rating: 4.8,
          reviewCount: 245,
          rooms: [
            {
              type: 'Ocean View Suite',
              capacity: 2,
              price: 350.00,
              available: 5,
              amenities: ['Balcony', 'Minibar', 'AC'],
            },
          ],
          policies: {
            checkIn: '14:00',
            checkOut: '11:00',
            cancellation: 'Free cancellation up to 24 hours before check-in',
            petsAllowed: false,
            smokingAllowed: false,
          },
          contact: {
            phone: '+960 123-4567',
            email: 'info@grandparadise.com',
            website: 'https://grandparadise.com',
          },
          isActive: true,
          isPopular: true,
          featured: true,
        },
        {
          name: 'Mountain View Lodge',
          locationCity: 'Switzerland',
          locationCountry: 'Switzerland',
          locationAddress: 'Alpine Valley, Switzerland',
          locationCoordinates: { lat: 46.5197, lng: 6.6323 },
          locationDistanceFromCenter: '5 km from city center',
          description: 'Cozy mountain lodge with stunning alpine views. Ideal for adventure seekers and nature lovers.',
          images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
          ],
          category: 'mountain' as const,
          amenities: ['WiFi', 'Fireplace', 'Restaurant', 'Ski Storage', 'Parking'],
          price: 180.00,
          rating: 4.5,
          reviewCount: 128,
          rooms: [
            {
              type: 'Mountain View Room',
              capacity: 2,
              price: 180.00,
              available: 8,
              amenities: ['Mountain View', 'Heating', 'TV'],
            },
          ],
          policies: {
            checkIn: '15:00',
            checkOut: '10:00',
            cancellation: 'Free cancellation up to 48 hours before check-in',
            petsAllowed: true,
            smokingAllowed: false,
          },
          contact: {
            phone: '+41 21 123-4567',
            email: 'info@mountainview.ch',
          },
          isActive: true,
          isPopular: true,
          featured: false,
        },
        {
          name: 'Urban Business Hotel',
          locationCity: 'New York',
          locationCountry: 'United States',
          locationAddress: '123 Business Street, NYC',
          locationCoordinates: { lat: 40.7128, lng: -74.0060 },
          locationDistanceFromCenter: '0.5 km from city center',
          description: 'Modern business hotel in the heart of the city. Perfect for corporate travelers.',
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
          ],
          category: 'business' as const,
          amenities: ['WiFi', 'Business Center', 'Restaurant', 'Fitness Center', 'Parking'],
          price: 250.00,
          originalPrice: 300.00,
          discount: 17,
          rating: 4.3,
          reviewCount: 312,
          rooms: [
            {
              type: 'Business Suite',
              capacity: 1,
              price: 250.00,
              available: 12,
              amenities: ['Work Desk', 'WiFi', 'AC', 'TV'],
            },
          ],
          policies: {
            checkIn: '15:00',
            checkOut: '12:00',
            cancellation: 'Free cancellation up to 24 hours before check-in',
            petsAllowed: false,
            smokingAllowed: false,
          },
          contact: {
            phone: '+1 212-123-4567',
            email: 'info@urbanbusiness.com',
          },
          isActive: true,
          isPopular: false,
          featured: true,
        },
      ];

      for (const hotelData of sampleHotels) {
        await Hotel.create(hotelData as any);
      }
      console.log(`✅ Created ${sampleHotels.length} sample hotels`);
    } else {
      console.log(`ℹ️  Hotels already exist (${hotelsCount} hotels in database)`);
    }

    // Create sample travel packages
    const packagesCount = await TravelPackage.count();
    if (packagesCount === 0) {
      const samplePackages = [
        {
          title: 'European Adventure Tour',
          destination: ['Paris', 'London', 'Rome'],
          description: 'Explore the best of Europe in this 10-day adventure covering three iconic cities.',
          images: [
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
            'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
          ],
          duration: { days: 10, nights: 9 },
          includes: ['Hotels', 'Breakfast', 'Guided Tours', 'Transportation'],
          price: 2500.00,
          originalPrice: 3000.00,
          discount: 17,
          rating: 4.7,
          reviewCount: 189,
          itinerary: [
            {
              day: 1,
              title: 'Arrival in Paris',
              description: 'Welcome to the City of Light',
              activities: ['City Tour', 'Eiffel Tower Visit'],
              meals: ['Dinner'],
              accommodation: 'Grand Hotel Paris',
            },
            {
              day: 2,
              title: 'Paris Exploration',
              description: 'Visit iconic landmarks',
              activities: ['Louvre Museum', 'Seine River Cruise'],
              meals: ['Breakfast', 'Lunch'],
            },
          ],
          highlights: ['Eiffel Tower', 'Big Ben', 'Colosseum', 'Art Museums'],
          exclusions: ['International Flights', 'Personal Expenses', 'Travel Insurance'],
          termsAndConditions: ['Minimum age 18', 'Valid passport required', 'Travel insurance recommended'],
          category: 'cultural' as const,
          maxTravelers: 25,
          minTravelers: 2,
          availability: [
            {
              startDate: new Date('2024-06-01'),
              endDate: new Date('2024-06-10'),
              available: true,
            },
            {
              startDate: new Date('2024-07-01'),
              endDate: new Date('2024-07-10'),
              available: true,
            },
          ],
          isActive: true,
          isPopular: true,
          featured: true,
        },
        {
          title: 'Tropical Paradise Getaway',
          destination: ['Maldives', 'Seychelles'],
          description: 'Relax and unwind in the world\'s most beautiful tropical destinations.',
          images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
          ],
          duration: { days: 7, nights: 6 },
          includes: ['Resort Stay', 'All Meals', 'Water Activities', 'Airport Transfers'],
          price: 3200.00,
          rating: 4.9,
          reviewCount: 156,
          itinerary: [
            {
              day: 1,
              title: 'Arrival in Maldives',
              description: 'Transfer to resort',
              activities: ['Snorkeling', 'Beach Time'],
              meals: ['Welcome Dinner'],
              accommodation: 'Beach Villa',
            },
          ],
          highlights: ['Crystal Clear Waters', 'Pristine Beaches', 'Water Sports', 'Luxury Resorts'],
          exclusions: ['International Flights', 'Spa Treatments', 'Personal Expenses'],
          termsAndConditions: ['Valid passport required', 'Travel insurance recommended'],
          category: 'beach' as const,
          maxTravelers: 15,
          minTravelers: 2,
          availability: [
            {
              startDate: new Date('2024-05-15'),
              endDate: new Date('2024-05-21'),
              available: true,
            },
          ],
          isActive: true,
          isPopular: true,
          featured: true,
        },
      ];

      for (const packageData of samplePackages) {
        await TravelPackage.create(packageData as any);
      }
      console.log(`✅ Created ${samplePackages.length} sample travel packages`);
    } else {
      console.log(`ℹ️  Travel packages already exist (${packagesCount} packages in database)`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
