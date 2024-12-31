require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connection successful!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection(); 