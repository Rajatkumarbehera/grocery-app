import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface Cart {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  quantity: number;
}

interface CartState {
  cartData: Cart[];
  subTotal: number;
  deliveryFee: number;
  finalTotal: number;
}

const initialState: CartState = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  finalTotal: 40,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state, action: PayloadAction<Cart>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>
    ) => {
      const item = state.cartData.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>
    ) => {
      const item = state.cartData.find((i) => i._id === action.payload);
      if (item?.quantity && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    calculateTotal: (state) => {
      state.subTotal = state.cartData.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );
      state.deliveryFee = state.subTotal > 499 ? 0 : 49;
      state.finalTotal = state.subTotal + state.deliveryFee;
    },
  },
});

export const {
  setCartData,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
