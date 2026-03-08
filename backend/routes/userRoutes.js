import express from "express";
import auth from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cartController.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

// All routes below require authentication
router.use(auth);

// Cart
router.get("/cart", getCart);
router.post("/cart", addToCart);
router.put("/cart/:id", updateCartItem);
router.delete("/cart/:id", removeFromCart);

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:id", removeFromWishlist);

export default router;
