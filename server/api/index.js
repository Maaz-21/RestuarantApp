import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import serverless from "serverless-http";
import mongoose from "mongoose";
import UserRoutes from "../routes/User.js";
import FoodRoutes from "../routes/Food.js";
import PaymentRoutes from "../routes/Payment.js";
dotenv.config();

const app = express();

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (e) {
    console.error("MongoDB connection error:", e);
  }
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // for form data

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});
// Routes
app.use("/api/user/", UserRoutes);
app.use("/api/food/", FoodRoutes);
app.use("/api/payment/", PaymentRoutes); 

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });
// Connect DB before handling any requests
await connectDB();

export const handler = serverless(app);