//store要把slice註冊起來
//store是設定檔, 要用configureStore

import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "../slice/cartSlice";
import messageReducer from "../slice/messageSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    message: messageReducer,
  },
});
