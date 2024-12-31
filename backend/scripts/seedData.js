const mongoose = require('mongoose');
const Company = require('../models/Company');

const seedCompanies = async () => {
  try {
    await mongoose.connect('your_mongodb_uri');

    // Clear existing data
    await Company.deleteMany({});

    // Insert sample companies
    const companies = await Company.create([
      {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        phone: "123-456-7890",
        highlightStatus: "red"
      },
      {
        name: "Digital Solutions",
        email: "info@digitalsolutions.com",
        phone: "098-765-4321",
        highlightStatus: "yellow"
      },
      {
        name: "Innovation Labs",
        email: "hello@innovationlabs.com",
        phone: "555-123-4567",
        highlightStatus: "none"
      }
    ]);

    console.log('Sample companies created:', companies);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedCompanies(); 