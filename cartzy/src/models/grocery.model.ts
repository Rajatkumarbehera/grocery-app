import { GroceryDocument } from "@/types/grocery";
import mongoose from "mongoose";

const grocerySchema = new mongoose.Schema<GroceryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Fruits & Vegetables", "Dairy & Eggs", "Personal Care"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "g", "liter", "ml", "piece"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Grocery =
  mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);
export default Grocery;
