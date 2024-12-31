require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create regular user
    const regularUser = new User({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user'
    });
    await regularUser.save();

    console.log('Test user created successfully:');
    console.log('Email: user@test.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser(); 