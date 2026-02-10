import mongoose from "mongoose";

export type UserRole = "customer" | "restaurant" | "delivery_partner" | "admin";

export type User = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image: string;
  mobile: string;
  location: {
    type: {
      type: String;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: Number[];
      default: number[];
    };
  };
  role: UserRole;
  socketId: string | null;
  isOnline: Boolean;
};
