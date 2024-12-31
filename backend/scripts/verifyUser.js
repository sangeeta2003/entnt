require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function verifyUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const user = await User.findOne({ email: 'san123@gmail.com' });
    console.log('\nUser verification:');
    console.log('User exists:', !!user);
    if (user) {
      console.log('User details:', {
        id: user._id,
        email: user.email,
        role: user.role,
        passwordHash: user.password
      });

      // Test password
      const isMatch = await bcrypt.compare('password123', user.password);
      console.log('Password verification:', isMatch);
    }

  } catch (error) {
    console.error('Verification error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyUser(); 