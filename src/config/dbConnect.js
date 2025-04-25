const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file
const { DATABASE_URI } = process.env;

const dbConnect = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = dbConnect;
