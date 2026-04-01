import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    text: "",
    status: "",
  },
  reducers: {
    createMessage(state, action) {
      state.text = action.payload.text;
      state.status = action.payload.status;
    },
    clearMessage(state) {
      state.text = "";
      state.status = "";
    },
  },
});

export const { createMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;
