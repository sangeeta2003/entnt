require('dotenv').config();
const mongoose = require('mongoose');
const CommunicationMethod = require('../models/CommunicationMethod');
const User = require('../models/User');

const defaultMethods = [
  {
    name: 'LinkedIn Post',
    description: 'Share company updates and announcements on LinkedIn company page to maintain visibility',
    sequence: 1,
    isMandatory: true,
    isActive: true
  },
  {
    name: 'LinkedIn Message',
    description: 'Direct message to company representatives through LinkedIn for personal connection',
    sequence: 2,
    isMandatory: true,
    isActive: true
  },
  {
    name: 'Email',
    description: 'Formal email communication for official correspondence and documentation',
    sequence: 3,
    isMandatory: true,
    isActive: true
  },
  {
    name: 'Phone Call',
    description: 'Direct voice communication for immediate response and personal touch',
    sequence: 4,
    isMandatory: false,
    isActive: true
  },
  {
    name: 'Other',
    description: 'Alternative communication methods like in-person meetings or video calls',
    sequence: 5,
    isMandatory: false,
    isActive: true
  }
];

async function initCommunicationMethods() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new Error('No admin user found. Please create an admin user first.');
    }

    // Clear existing methods
    const deleteResult = await CommunicationMethod.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing methods`);

    // Create default methods
    for (const method of defaultMethods) {
      const newMethod = await CommunicationMethod.create({
        ...method,
        createdBy: admin._id
      });
      console.log(`Created method: ${newMethod.name}`);
    }

    console.log('\nDefault communication methods initialized successfully!');
    
    // Verify all methods
    const methods = await CommunicationMethod.find().sort('sequence');
    console.log('\nVerifying created methods:');
    methods.forEach(method => {
      console.log(`${method.sequence}. ${method.name} (${method.isMandatory ? 'Mandatory' : 'Optional'})`);
    });

  } catch (error) {
    console.error('Error initializing communication methods:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
console.log('Starting communication methods initialization...');
initCommunicationMethods(); 