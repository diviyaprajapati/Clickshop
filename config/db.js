const mongoose = require('mongoose');

const connectDB = async () => {
  try { 
    // const mongoURI = process.env.LOCAL_URI;
 const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
    });

    console.log(`✅ MongoDB connected to ${mongoURI.includes('127.0.0.1') ? 'Localhost' : 'Atlas Cluster'}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
