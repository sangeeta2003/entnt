require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function verifyAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Find admin user
    let adminUser = await User.findOne({ email: 'shr123@gmail.com' });
    
    if (adminUser) {
      // Update existing user to admin if needed
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('Updated existing user to admin role');
      }
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      adminUser = new User({
        name: 'Admin User',
        email: 'shr123@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('Created new admin user');
    }

    // Verify the user
    const verifiedUser = await User.findOne({ email: 'shr123@gmail.com' });
    console.log('\nAdmin User Verification:');
    console.log('Email:', verifiedUser.email);
    console.log('Role:', verifiedUser.role);
    console.log('Is Admin?:', verifiedUser.role === 'admin');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyAdmin(); 