import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/cart`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch cart",
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${BACKEND_URL}/cart`,
        { productId, quantity },
        getAuthHeader(),
      );
      // Re-fetch to get joined product data
      const res = await axios.get(`${BACKEND_URL}/cart`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to add to cart",
      );
    }
  },
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${BACKEND_URL}/cart/${id}`,
        { quantity },
        getAuthHeader(),
      );
      const res = await axios.get(`${BACKEND_URL}/cart`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update cart",
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/cart/${id}`, getAuthHeader());
      const res = await axios.get(`${BACKEND_URL}/cart`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to remove from cart",
      );
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
