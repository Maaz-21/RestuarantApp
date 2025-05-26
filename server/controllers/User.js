import bcrypt from "bcrypt";
import { generateToken } from "../utils/genrateT.js";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";

dotenv.config();

// Auth

export const UserRegister = async (req, res, next) => {
  const { email, password, name, img } = req.body;
  try {
    if (!email || !name || !password) {
            return next(createError(400, "Please fill all fields" ));
        }
    //Check for existing user
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img: img || null,
    });
    const newUser = await user.save();
    console.log("User registered successfully", newUser);
    const t =generateToken(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.name,  // Using 'username' for frontend compatibility
      email: newUser.email,
      profilePic: newUser.img,
      token: t,
    });
  } catch (err) {
    console.error("Error creating user in UserRegister User.js:", err);
    next(err);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("UserLogin", req.body);
    //Check for existing user
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return next(createError(409, "User not found."));
    }
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }
    const t=generateToken(user._id, res);
    res.status(200).json({
              _id: user._id,
              username: user.name,
              email: user.email,
              profilePic: user.img,
              token: t,
    });
    console.log("User logged in successfully", user);
  } catch (err) {
    console.error("Error logging in user in UserLogin User.js:", err);
    next(err);
  }
};

//Cart

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    console.log("addToCart", req.body);
    const userJWT = req.user;
    console.log("userJWT", userJWT);
    const user = await User.findById(userJWT.userId);
    console.log("user1", user);
    const existingCartItemIndex = user.cart.findIndex((item) =>
      item.product && item.product.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    console.log("user2", user);
    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    createError(500, "Error adding product to cart");
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    console.log("removeFromCart", req.body);
    const userJWT = req.user;
    console.log("userJWT", userJWT);
    const user = await User.findById(userJWT.userId);
    console.log("user", user);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1); // Remove the product from the cart
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in the user's cart"));
    }
  } catch (err) {
    createError(500, "Error removing product from cart");
    next(err);
  }
};

export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.userId).populate({
      path: "cart.product",
      model: "Food",
    });
    const cartItems = user.cart;
    return res.status(200).json(cartItems);
  } catch (err) {
    createError(500, "Error fetching cart items");
    next(err);
  }
};

//Orders

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount, razorpay_order_id, razorpay_payment_id } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.userId);

    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
      razorpay_order_id,
      razorpay_payment_id,
      payment_status: 'completed'
    });
    await order.save();
    user.cart = [];
    user.orders.push(order._id);
    await user.save();
    console.log("Order placed successfully", user);
    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orders = await Orders.find({ user: userId })
      .populate({
        path: "products.product",
        model: "Food"
      })
      .sort({ createdAt: -1 }); // Optional: sort by newest first

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders in getAllOrders:", err);
    next(err);
  }
};
//Favorites

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.userId);
    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.userId);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }
    return res
      .status(200)
      .json({ message: "Product added to favorites ", user });
  } catch (err) {
    next(err);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const favoriteProducts = user.favourites;
    return res.status(200).json(favoriteProducts);
  } catch (err) {
    next(err);
  }
};
