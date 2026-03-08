import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/wishlist`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch wishlist",
      );
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.post(
        `${BACKEND_URL}/wishlist`,
        { productId },
        getAuthHeader(),
      );
      const res = await axios.get(`${BACKEND_URL}/wishlist`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to add to wishlist",
      );
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/wishlist/${id}`, getAuthHeader());
      const res = await axios.get(`${BACKEND_URL}/wishlist`, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to remove from wishlist",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
