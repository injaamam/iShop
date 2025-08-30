import { configureStore } from "@reduxjs/toolkit";
import hamburgerReducer from "./features/hamburgerSlice.js";
import filterReducer from "./features/filterSlice.js";

export const store = configureStore({
  reducer: {
    hamburger: hamburgerReducer,
    filter: filterReducer,
  },
});
