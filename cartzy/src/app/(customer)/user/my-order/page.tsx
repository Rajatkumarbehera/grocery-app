"use client";

import { getSocket } from "@/lib/socket";
import { User } from "@/types/user";
import axios from "axios";
import mongoose from "mongoose";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  status: "pending" | "out of delivery" | "delivered";
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: User;
  createdAt: string;
}

export default function MyOrderpage() {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const getMyOrders = async () => {
    try {
      const result = await axios.get("/api/user/my-order");
      setAllOrders(result.data);
      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleStatusUpdate = (data: {
      orderId: string;
      status: Order["status"];
    }) => {
      setAllOrders((prev) =>
        prev.map((order) =>
          order._id?.toString() === data.orderId
            ? { ...order, status: data.status }
            : order,
        ),
      );
    };

    socket.on("order-status-update", handleStatusUpdate);

    return () => {
      socket.off("order-status-update", handleStatusUpdate);
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const handleOrderAssigned = (data: {
      orderId: string;
      assignedDeliveryBoy: User;
    }) => {
      setAllOrders((prev) =>
        prev.map((order) =>
          order._id?.toString() === data.orderId
            ? { ...order, assignedDeliveryBoy: data.assignedDeliveryBoy }
            : order,
        ),
      );
    };
    socket.on("order-assigned", handleOrderAssigned);
    return () => {
      socket.off("order-assigned", handleOrderAssigned);
    };
  }, []);

  return (
    <div>
      <p>My Orders</p>
      <div>
        {allOrders?.map((order) => (
          <div
            key={order._id?.toString()}
            className="p-4 border rounded-lg mb-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">
                Order #{order._id?.toString()}
              </h3>
              <p className="bg-green-500 rounded-full px-2 py-1 text-xs capitalize">
                {order.status}
              </p>
            </div>

            {/* Order Details */}
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Status: {order.isPaid ? "Paid" : "Not Paid"}</p>

            {order.assignedDeliveryBoy && (
              <div>
                <div>
                  <p>Assigned to {order.assignedDeliveryBoy.name}</p>
                  <p>{order.assignedDeliveryBoy.mobile}</p>
                </div>
                <a
                  href={`tel:${order.assignedDeliveryBoy.mobile}`}
                  className="bg-green-500 text-white px-2 py-1 rounded-lg"
                >
                  Call
                </a>
                <div className="flex items-center gap-4">
                  <p>Track your order</p>
                  <button
                    className="bg-red-500 text-white cursor-pointer rounded-lg py-1 px-4"
                    onClick={() =>
                      router.push(`/user/track-order/${order._id}`)
                    }
                  >
                    Track
                  </button>
                </div>
              </div>
            )}

            {/* Address */}
            <div className="mt-2">
              <p>
                <strong>Address:</strong> {order?.address?.fullAddress}
              </p>
              {/* <p>
                <strong>Name:</strong> {order.address.fullName}
              </p>
              <p>
                <strong>City:</strong> {order.address.city}
              </p>
              <p>
                <strong>State:</strong> {order.address.state}
              </p>
              <p>
                <strong>Pincode:</strong> {order.address.pincode}
              </p>
              <p>
                <strong>Mobile:</strong> {order.address.mobile}
              </p> */}
            </div>

            {/* Items */}
            <div className="mt-3">
              {/* <h4 className="font-semibold">Items:</h4> */}
              {order.items?.map((item, i) => (
                <div key={i} className="border p-2 mt-2 rounded">
                  <p>
                    <strong>{item.name}</strong>
                  </p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
