
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    saveToken: (state, action) => {
      state.token = action.payload;
    },
    saveUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { saveToken, saveUser } = authSlice.actions;
export default authSlice.reducer;
