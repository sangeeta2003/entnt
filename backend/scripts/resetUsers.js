require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function resetUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Delete all existing users
    await User.deleteMany({});
    console.log('Deleted all existing users');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'san123@gmail.com',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();

    // Create regular user
    const regularUser = new User({
      name: 'Regular User',
      email: 'varsha123@gmail.com',
      password: 'password123',
      role: 'user'
    });
    await regularUser.save();

    console.log('\nUsers created successfully!');
    console.log('\nAdmin User:');
    console.log('Email: san123@gmail.com');
    console.log('Password: password123');
    console.log('\nRegular User:');
    console.log('Email: varsha123@gmail.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetUsers(); 