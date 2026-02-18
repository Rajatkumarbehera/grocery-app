import { UserDocument } from "@/types/user";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,              
      trim: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    image: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    role: {
      type: String,
      enum: ["admin", "customer", "delivery_partner", "restaurant"],
      default: "customer",
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
