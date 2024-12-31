require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First, delete any existing admin user
    await User.deleteOne({ email: 'admin@admin.com' });
    console.log('Cleaned up existing admin user');

    // Create a new admin user with proper password hashing
    const admin = new User({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'Admin@123', // Will be hashed by the User model pre-save middleware
      role: 'admin'
    });

    await admin.save();

    // Verify the user was created
    const verifyAdmin = await User.findOne({ email: 'admin@admin.com' });
    console.log('Created admin user:', {
      email: verifyAdmin.email,
      role: verifyAdmin.role,
      _id: verifyAdmin._id,
      hasPassword: !!verifyAdmin.password
    });

    console.log('\nAdmin setup complete!');
    console.log('You can now login with:');
    console.log('Email: admin@admin.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdminUser(); 