const mongoose = require ('mongoose');
require('dotenv').config();

const connectDB = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MongoDB_URI);
      console.log('Connected to MongoDB successfully');
      console.log(`Database : ${mongoose.connection.name}`);
      return;
    } catch (err) {
      console.log(`Connection attempt ${i + 1} failed. Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('Unable to connect to the database after multiple attempts');
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection lost');
});

mongoose.connection.on('error', (error) => {
  console.error(`MongoDB connection error: ${error}`);
});

connectDB();

module.exports = connectDB;