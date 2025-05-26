import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/reducers/SnackbarSlice';
import { createRazorpayOrder, verifyRazorpayPayment, placeOrder } from '../api';

const PaymentContainer = styled.div`
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  margin-top: 20px;
`;

const PaymentInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  border-left: 4px solid #007bff;
`;

const UPIPayment = ({ totalAmount, deliveryDetails, products, onPaymentSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  console.log('UPIPayment received:', { totalAmount, deliveryDetails, products });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const convertAddressToString = (addressObj) => {
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }
      if (!products || !Array.isArray(products) || products.length === 0) {
        throw new Error('No products found in cart');
      }
      const token = localStorage.getItem('foodeli-app-token');
      
      // Step 1: Create Razorpay order with products and address
      const orderResponse = await createRazorpayOrder(token, {
        amount: totalAmount,
        currency: 'INR',
        products: products.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        address: convertAddressToString(deliveryDetails)
      });

      const orderData = orderResponse.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Foodeli',
        description: 'Food Order Payment',
        order_id: orderData.orderId,
        prefill: {
          name: `${deliveryDetails.firstName} ${deliveryDetails.lastName}`,
          email: deliveryDetails.emailAddress,
          contact: deliveryDetails.phoneNumber
        },
        theme: {
          color: '#007bff'
        },
        handler: async function (response) {
          try {
            // Step 2: Verify payment
            const verifyResponse = await verifyRazorpayPayment(token, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              // Payment verified successfully
              onPaymentSuccess({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            dispatch(openSnackbar({
              message: 'Payment verification failed',
              severity: 'error'
            }));
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      dispatch(openSnackbar({
        message: error.message || 'Payment failed',
        severity: 'error'
      }));
      setLoading(false);
    }
  };

  return (
    <PaymentContainer>
      <h3>Payment Gateway</h3>
      <p><strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong></p>
      
      <PaymentInfo>
        <h4>💳 Payment Methods Available:</h4>
        <ul>
          <li>🔹 UPI (PhonePe, Google Pay, Paytm, BHIM)</li>
          <li>🔹 Credit/Debit Cards</li>
          <li>🔹 Net Banking</li>
          <li>🔹 Digital Wallets</li>
        </ul>
      </PaymentInfo>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button
          text={loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
          onClick={handlePayment}
          disabled={loading}
          isLoading={loading}
        />
        <Button
          text="Cancel"
          outlined
          onClick={onCancel}
          disabled={loading}
        />
      </div>
    </PaymentContainer>
  );
};

export default UPIPayment;