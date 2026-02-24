import mongoose from "mongoose";

export type Category = "Fruits & Vegetables" | "Dairy & Eggs" | "Personal Care";

export type Unit = "kg" | "g" | "liter" | "ml" | "piece";

export type Grocery = {
  name: string;
  category: Category;
  price: number;
  unit: Unit;
  image: string;
};

export type GroceryDocument = Grocery & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type GroceryClient = Grocery & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
