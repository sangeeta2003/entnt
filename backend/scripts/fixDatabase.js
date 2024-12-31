require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function fixDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected successfully');

    // Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('Users cleared');

    // Create new test users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Sangeeta',
        email: 'san123@gmail.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Varsha',
        email: 'varsha123@gmail.com',
        password: hashedPassword,
        role: 'user'
      }
    ];

    console.log('Creating test users...');
    await User.insertMany(users);
    
    // Verify users
    const createdUsers = await User.find({});
    console.log('\nCreated Users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });

    console.log('\nTest credentials:');
    console.log('1. Admin User:');
    console.log('   Email: san123@gmail.com');
    console.log('   Password: password123');
    console.log('\n2. Regular User:');
    console.log('   Email: varsha123@gmail.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  }
}

fixDatabase(); 