import mongoose from "mongoose";

export type UserRole = "admin" | "customer" | "delivery_partner" | "restaurant";

export type GeoLocation = {
  type: "Point";
  coordinates: [number, number];
};

export type User = {
  name: string;
  email: string;
  password: string;
  image: string;
  mobile: string;
  location: GeoLocation;
  role: UserRole;
  socketId: string | null;
  isOnline: boolean;
};

export type UserDocument = User & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type UserClient = Omit<User, "password"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
