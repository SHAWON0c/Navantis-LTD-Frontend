// src/redux/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,        // user info (employeeId, role, etc.)
  token: null,       // JWT token
  emailToVerify: "", // for register/verify flow
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    setEmailToVerify: (state, action) => {
      state.emailToVerify = action.payload;
    },
    resetAuthState: () => initialState,
  },
});

export const { setCredentials, setEmailToVerify, resetAuthState } = authSlice.actions;

// ✅ Selectors for easier access
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
