import mongoose from "mongoose";

interface Grocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
}

const grocerySchema = new mongoose.Schema<Grocery>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Fruits & Vegetables", "Dairy & Eggs", "Personal Care"],
    },
    price: {
      type: String,
      required: true,
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
  { timestamps: true }
);

const Grocery =
  mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);
export default Grocery;
