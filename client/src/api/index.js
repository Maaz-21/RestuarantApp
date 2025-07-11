import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

//auth
export const UserSignUp = async (data) => await API.post("/user/signup", data);
export const UserSignIn = async (data) => await API.post("/user/signin", data);

//products
export const getAllProducts = async (filter) => {
  const url = filter ? `/food?${filter}` : `/food`;
  return await API.get(url);
};


export const getProductDetails = async (id) => await API.get(`/food/${id}`);


//Cart
export const getCart = async (token) =>
  await API.get(`/user/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = async (token, data) =>
  await API.post(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromCart = async (token, data) =>
  await API.patch(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//favorites

export const getFavourite = async (token) =>
  await API.get(`/user/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToFavourite = async (token, data) =>
  await API.post(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromFavourite = async (token, data) =>
  await API.patch(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Orders
export const placeOrder = async (token, data) =>
  await API.post(`/user/order/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrders = async (token) =>
  await API.get(`/user/order/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
// Add these payment-related API calls
export const createRazorpayOrder = async (token, data) =>
  await API.post('/payment/create-order', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const verifyRazorpayPayment = async (token, data) =>
  await API.post('/payment/verify-payment', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
