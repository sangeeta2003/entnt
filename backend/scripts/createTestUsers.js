require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing test users
    await User.deleteMany({ 
      email: { 
        $in: ['admin@test.com', 'user@test.com'] 
      } 
    });

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create regular user
    const regularUser = new User({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user'
    });
    await regularUser.save();

    console.log('\nTest users created successfully!');
    console.log('\nAdmin User:');
    console.log('Email: admin@test.com');
    console.log('Password: admin123');
    console.log('\nRegular User:');
    console.log('Email: user@test.com');
    console.log('Password: user123');

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUsers(); 