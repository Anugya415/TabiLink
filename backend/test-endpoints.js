// Use built-in fetch in Node.js 18+ or fallback to node-fetch
let fetch;
try {
  // Try to use global fetch (Node 18+)
  if (typeof global.fetch !== 'undefined') {
    fetch = global.fetch;
  } else {
    fetch = require('node-fetch');
  }
} catch (e) {
  console.error('❌ Fetch is not available. Please use Node.js 18+ or install node-fetch');
  process.exit(1);
}

const API_BASE_URL = 'http://localhost:5000/api/v1';

let authToken = '';
let userId = '';
let hotelId = '';
let packageId = '';

async function testEndpoint(name, method, url, body = null, useAuth = false) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (useAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   ${method} ${url}`);
    if (body) {
      console.log(`   Body:`, JSON.stringify(body, null, 2));
    }

    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (response.ok) {
      console.log(`   ✅ Success (${response.status})`);
      if (typeof data === 'object') {
        console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 500));
      }
      return { success: true, data, status: response.status };
    } else {
      console.log(`   ❌ Failed (${response.status})`);
      console.log(`   Error:`, typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Backend API Tests');
  console.log('='.repeat(60));

  // Test 1: Register a new user
  console.log('\n📝 TEST 1: User Registration');
  const registerResult = await testEndpoint(
    'Register User',
    'POST',
    `${API_BASE_URL}/auth/register`,
    {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      phone: '+1234567890',
    }
  );

  if (registerResult.success && registerResult.data.data) {
    authToken = registerResult.data.data.token;
    userId = registerResult.data.data.user.id;
    console.log(`   👤 User ID: ${userId}`);
    console.log(`   🔑 Token received: ${authToken.substring(0, 20)}...`);
  }

  // Test 2: Login with existing user
  console.log('\n📝 TEST 2: User Login');
  const loginResult = await testEndpoint(
    'Login User',
    'POST',
    `${API_BASE_URL}/auth/login`,
    {
      email: 'user@tabilink.com',
      password: 'user1234',
    }
  );

  if (loginResult.success && loginResult.data.data) {
    authToken = loginResult.data.data.token;
    userId = loginResult.data.data.user.id;
    console.log(`   👤 Logged in as: ${loginResult.data.data.user.name}`);
    console.log(`   🔑 Token received: ${authToken.substring(0, 20)}...`);
  }

  // Test 3: Get current user (me)
  console.log('\n📝 TEST 3: Get Current User');
  await testEndpoint(
    'Get Me',
    'GET',
    `${API_BASE_URL}/auth/me`,
    null,
    true
  );

  // Test 4: Get all hotels
  console.log('\n📝 TEST 4: Get All Hotels');
  const hotelsResult = await testEndpoint(
    'Get Hotels',
    'GET',
    `${API_BASE_URL}/hotels`,
    null,
    false
  );

  if (hotelsResult.success && hotelsResult.data.data && hotelsResult.data.data.hotels.length > 0) {
    hotelId = hotelsResult.data.data.hotels[0].id;
    console.log(`   🏨 Found ${hotelsResult.data.data.hotels.length} hotels`);
    console.log(`   🏨 Using Hotel ID: ${hotelId}`);
  }

  // Test 5: Get single hotel
  if (hotelId) {
    console.log('\n📝 TEST 5: Get Single Hotel');
    await testEndpoint(
      'Get Hotel by ID',
      'GET',
      `${API_BASE_URL}/hotels/${hotelId}`,
      null,
      false
    );
  }

  // Test 6: Get all travel packages
  console.log('\n📝 TEST 6: Get All Travel Packages');
  const packagesResult = await testEndpoint(
    'Get Packages',
    'GET',
    `${API_BASE_URL}/packages`,
    null,
    false
  );

  if (packagesResult.success && packagesResult.data.data && packagesResult.data.data.packages.length > 0) {
    packageId = packagesResult.data.data.packages[0].id;
    console.log(`   ✈️ Found ${packagesResult.data.data.packages.length} packages`);
    console.log(`   ✈️ Using Package ID: ${packageId}`);
  }

  // Test 7: Get single travel package
  if (packageId) {
    console.log('\n📝 TEST 7: Get Single Travel Package');
    await testEndpoint(
      'Get Package by ID',
      'GET',
      `${API_BASE_URL}/packages/${packageId}`,
      null,
      false
    );
  }

  // Test 8: Create hotel booking
  if (hotelId && authToken) {
    console.log('\n📝 TEST 8: Create Hotel Booking');
    const bookingResult = await testEndpoint(
      'Create Hotel Booking',
      'POST',
      `${API_BASE_URL}/bookings`,
      {
        type: 'hotel',
        hotel: hotelId.toString(),
        checkIn: '2024-06-15',
        checkOut: '2024-06-20',
        travelers: 2,
        guests: [
          {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+1234567890',
          },
        ],
      },
      true
    );

    if (bookingResult.success) {
      console.log(`   ✅ Booking created successfully`);
    }
  }

  // Test 9: Create travel package booking
  if (packageId && authToken) {
    console.log('\n📝 TEST 9: Create Travel Package Booking');
    const bookingResult = await testEndpoint(
      'Create Travel Package Booking',
      'POST',
      `${API_BASE_URL}/bookings`,
      {
        type: 'travel',
        travelPackage: packageId.toString(),
        travelers: 2,
        guests: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            phone: '+1234567891',
          },
        ],
      },
      true
    );

    if (bookingResult.success) {
      console.log(`   ✅ Booking created successfully`);
    }
  }

  // Test 10: Get user bookings
  if (authToken) {
    console.log('\n📝 TEST 10: Get User Bookings');
    await testEndpoint(
      'Get Bookings',
      'GET',
      `${API_BASE_URL}/bookings`,
      null,
      true
    );
  }

  // Test 11: Submit contact form
  console.log('\n📝 TEST 11: Submit Contact Form');
  await testEndpoint(
    'Submit Contact',
    'POST',
    `${API_BASE_URL}/contact`,
    {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Inquiry',
      message: 'This is a test message from the API test script.',
    },
    false
  );

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!');
}

// Check if node-fetch is available, otherwise use built-in fetch (Node 18+)
if (typeof fetch === 'undefined') {
  try {
    global.fetch = require('node-fetch');
  } catch (e) {
    console.error('❌ Please install node-fetch: npm install node-fetch');
    console.error('   Or use Node.js 18+ which has built-in fetch');
    process.exit(1);
  }
}

runTests().catch(console.error);

