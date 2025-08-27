import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterOpen: false,
};

const hamburgerSlice = createSlice({
  name: "hamburger",
  initialState,
  reducers: {
    toggleHamburger: (state) => {
      state.filterOpen = !state.filterOpen;
    },
    setHamburger: (state, action) => {
      state.filterOpen = action.payload;
    },
  },
});
// console.log(hamburgerSlice.reducer);

export const { toggleHamburger } = hamburgerSlice.actions;
export default hamburgerSlice.reducer;
