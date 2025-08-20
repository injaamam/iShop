import { configureStore } from "@reduxjs/toolkit";
import hamburgerReducer from "./features/hamburgerSlice.js";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerReducer,
  },
});
