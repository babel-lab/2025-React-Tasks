import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createMessage } from "./messageSlice";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

export const cartSlice = createSlice({
  //name 就是 id, 識別SLICE的方法.
  name: "cart",
  initialState: {
    carts: [],
    total: 0,
    final_total: 0,
  },
  //CALL完API後的資料存入動作
  reducers: {
    //action
    //把API取得的CART資料,存到STATE裡
    updateCart(state, action) {
      state.carts = action.payload.carts;
      state.total = action.payload.total;
      state.final_total = action.payload.final_total;
    },
  },
});

//建立取得購物車的API
export const createAsyncGetCart = createAsyncThunk(
  "cart/createAsyncGetCart",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);

      //使用dispatch去call action裡的slice
      dispatch(updateCart(response.data.data));

      dispatch(
        createMessage({
          text: "購物車資料取得成功",
          status: "success",
        }),
      );
    } catch (error) {
      dispatch(
        createMessage({
          text: "購物車資料取得失敗",
          status: "failed",
        }),
      );
      console.log(error.response || error);
    }
  },
);

//加入購物車
export const createAsyncAddCart = createAsyncThunk(
  "cart/createAsyncAddCart",
  async (data, { dispatch }) => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });

      dispatch(
        createMessage({
          text: "加入購物車成功",
          status: "success",
        }),
      );

      //加入成功後，重新抓一次購物車
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createMessage({
          text: "加入購物車失敗",
          status: "failed",
        }),
      );
      console.log(error.response || error);
    }
  },
);

//刪除購物車內單一產品
export const createAsyncDelCart = createAsyncThunk(
  "cart/createAsyncDelCart",
  async (id, { dispatch }) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);

      dispatch(
        createMessage({
          text: "刪除購物車商品成功",
          status: "success",
        }),
      );

      //刪除成功後，重新抓一次購物車
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createMessage({
          text: "刪除購物車商品失敗",
          status: "failed",
        }),
      );
      console.log(error.response || error);
    }
  },
);

//清空購物車
export const createAsyncClearCart = createAsyncThunk(
  "cart/createAsyncClearCart",
  async (_, { dispatch }) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);

      dispatch(
        createMessage({
          text: "清空購物車成功",
          status: "success",
        }),
      );

      //清空成功後，重新抓一次購物車
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createMessage({
          text: "清空購物車失敗",
          status: "failed",
        }),
      );
      console.log(error.response || error);
    }
  },
);

//更新購物車商品數量
export const createAsyncUpdateCart = createAsyncThunk(
  "cart/createAsyncUpdateCart",
  async ({ cartId, product_id, qty }, { dispatch }) => {
    try {
      const data = {
        product_id,
        qty,
      };

      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {
        data,
      });

      dispatch(
        createMessage({
          text: "更新購物車數量成功",
          status: "success",
        }),
      );

      //更新成功後，重新抓一次購物車
      dispatch(createAsyncGetCart());
    } catch (error) {
      dispatch(
        createMessage({
          text: "更新購物車數量失敗",
          status: "failed",
        }),
      );
      console.log(error.response || error);
    }
  },
);

//reducer的action cart匯出
export const { updateCart } = cartSlice.actions;

export default cartSlice.reducer;