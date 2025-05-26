import mongoose from "mongoose";
import Food from "../models/Food.js";
import { sampleFood } from "./data.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://maazkhatik1234:LvaFpB5Q8OMXs0jX@food.cbeivfs.mongodb.net/?retryWrites=true&w=majority&appName=Food"
    );
    console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`);
  } catch (e) {
    console.log("Mongo Error: ", e);
    process.exit(1); // Exit on connection failure
  }
};

const initDB = async () => {
  await connectDB(); // ✅ Wait for DB connection
  await Food.deleteMany({});
  await Food.insertMany(sampleFood);
  console.log("Database initialized with sample data");
};

initDB()
  .then(() => {
    console.log("Database initialized successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
    mongoose.connection.close();
  });
