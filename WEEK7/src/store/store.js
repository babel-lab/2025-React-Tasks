import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slice/messageSlice";
import authReducer from "../slice/authSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
  },
});

export default store;
