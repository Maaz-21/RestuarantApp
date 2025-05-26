import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import FoodRoutes from "./routes/Food.js";
import PaymentRoutes from "./routes/Payment.js";
dotenv.config();

const app = express();

const connectDB = async ()=> {
  try{
    const conn= await mongoose.connect(process.env.MONGO_URL); 
    console.log(`MongoDB connected: ${conn.connection.host}` + ":"+conn.connection.port);
  }catch(e){
    console.log("Mongo Error: ",e);
  }
};

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});


