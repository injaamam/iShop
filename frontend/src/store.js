import { configureStore } from "@reduxjs/toolkit";
import hamburgerReducer from "./features/hamburgerSlice.js";
import filterReducer from "./features/filterSlice.js";
import authReducer from "./features/authSlice.js";
import cartReducer from "./features/cartSlice.js";
import wishlistReducer from "./features/wishlistSlice.js";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerReducer,
    filter: filterReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
