import express from "express";
import { createOrder, verifyPayment } from "../controllers/Payment.js";
import { verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);

export default router;
