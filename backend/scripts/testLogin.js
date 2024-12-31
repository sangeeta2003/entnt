require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function testLogin(email, password) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`\nTesting login for ${email}`);
    
    // Find user
    const user = await User.findOne({ email });
    console.log('User found:', !!user);
    
    if (user) {
      // Test password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      console.log('User details:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHashLength: user.password.length
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Test both users
async function runTests() {
  await testLogin('san123@gmail.com', 'password123');
  await testLogin('varsha123@gmail.com', 'password123');
}

runTests(); 