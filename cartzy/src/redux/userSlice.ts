import { UserClient } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userData: UserClient | null;
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
