import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface User {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
  mobile?: string;
  role: "customer" | "restaurant" | "delivery_partner" | "admin";
}

interface UserState {
  userData: User | null;
}

const initialState: UserState = {
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
