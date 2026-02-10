import mongoose from "mongoose";

interface Order {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    state: string;
    pincode: string;
    mobile: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: mongoose.Types.ObjectId;
  status: "pending" | "out of delivery" | "delivered";
  deliveryOTP: string | null;
  deliveryOTPVerification: boolean;
  deliveredAt: Date;
}

const orderSchema = new mongoose.Schema<Order>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: String,
        price: String,
        unit: String,
        image: String,
        quantity: Number,
      },
    ],
    isPaid: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    address: {
      fullName: String,
      city: String,
      state: String,
      pincode: String,
      mobile: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    assignment: {
      type: mongoose.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "out of delivery", "delivered"],
      default: "pending",
    },
    deliveryOTP: {
      type: String,
      default: null,
    },
    deliveryOTPVerification: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
