import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuth = action.payload;
    },
    logout(state) {
      state.isAuth = false;

      // 清 cookie token
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 清 axios header
      delete axios.defaults.headers.common.Authorization;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
