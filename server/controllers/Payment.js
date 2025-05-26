import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createError } from '../error.js';
import Orders from '../models/Orders.js'; 

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', products, address } = req.body; 
    if (!amount || amount <= 0) {
       return next(createError(400, 'Invalid amount'));
    }
    const userJWT = req.user;
     // Generate a shorter receipt - max 40 characters
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const userIdShort = userJWT.userId.toString().slice(-6); // Last 6 chars of userId
    const receipt = `ord_${timestamp}_${userIdShort}`; // This will be ~20 characters
    const options = {
      amount: amount * 100, // Amount in paise (multiply by 100)
      currency: currency,
      receipt: receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    const newOrder = new Orders({
      user: userJWT.userId,
      products,
      total_amount: amount,
      address,
      razorpay_order_id: order.id,
      razorpay_payment_id: '', // Will be updated after payment
      payment_status: 'pending'
    });
    await newOrder.save();
    
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      receipt: order.receipt,
      dbOrderId: newOrder._id
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    next(createError(500, 'Failed to create payment order'));
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const updatedOrder = await Orders.findOneAndUpdate(
        { razorpay_order_id: razorpay_order_id },
        {
          razorpay_payment_id: razorpay_payment_id,
          payment_status: 'completed',
          status: 'Payment Done'
        },
        { new: true }
      );

      if (!updatedOrder) {
        return next(createError(404, 'Order not found'));
      }
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        order: updatedOrder
      });
    } else {
        // Update payment status to failed
      await Orders.findOneAndUpdate(
        { razorpay_order_id: razorpay_order_id },
        { payment_status: 'failed' }
      );
      res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    next(createError(500, 'Failed to verify payment'));
  }
};
