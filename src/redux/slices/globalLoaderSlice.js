import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingCount: 0,
};

const globalLoaderSlice = createSlice({
  name: "globalLoader",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loadingCount += 1;
    },
    stopLoading: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
  },
});

export const { startLoading, stopLoading } = globalLoaderSlice.actions;
export default globalLoaderSlice.reducer;
