const mongoose = require('mongoose');
const { seedRooms } = require('../seedData');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/daily-schedule');
    console.log('Connected to MongoDB');
    
    await seedRooms();
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();