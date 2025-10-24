const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function debugAuth() {
  console.log('===========================================');
  console.log('DEBUG AUTHENTICATION');
  console.log('===========================================');
  console.log();

  try {
    // Test 1: Check server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', healthResponse.data);
    console.log();

    // Test 2: Check if users exist in database
    console.log('2. Testing database connection...');
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5432/neuroplan?schema=public',
    });

    const usersResult = await pool.query('SELECT email, role FROM "User" LIMIT 5');
    console.log('✅ Database connected. Users found:', usersResult.rows.length);
    usersResult.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    console.log();

    // Test 3: Try login with detailed error
    console.log('3. Testing login with detailed error...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@demo.com',
        password: 'Admin123!'
      });
      console.log('✅ Login successful!');
      console.log('   Token:', loginResponse.data.accessToken.substring(0, 20) + '...');
      console.log('   User:', loginResponse.data.usuario);
    } catch (loginError) {
      console.log('❌ Login failed:');
      if (loginError.response) {
        console.log('   Status:', loginError.response.status);
        console.log('   Message:', loginError.response.data.message);
        console.log('   Data:', JSON.stringify(loginError.response.data, null, 2));
      } else {
        console.log('   Error:', loginError.message);
      }
    }
    console.log();

    await pool.end();

  } catch (error) {
    console.log('❌ CRITICAL ERROR:');
    console.log(error.message);
    console.log();
  }
}

// Run debug
debugAuth();
