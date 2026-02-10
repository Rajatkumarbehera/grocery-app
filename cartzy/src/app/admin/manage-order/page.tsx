"use client";

import { getSocket } from "@/lib/socket";
import { User } from "@/types/user";
import axios from "axios";
import { UserCheck } from "lucide-react";
import mongoose from "mongoose";
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
  // assignedDeliveryBoy?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: User;
  createdAt: string;
}

const status = ["pending", "out of delivery", "delivered"];

export default function ManageOrderpage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const getMyOrders = async () => {
    try {
      const result = await axios.get("/api/admin/manage-order");
      setAllOrders(result.data);
      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const result = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        { status },
      );

      setAllOrders((prev) =>
        prev.map((order) =>
          order._id?.toString() === orderId
            ? { ...order, status: status as Order["status"] }
            : order,
        ),
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    const handleNewOrder = (newOrder: Order) => {
      setAllOrders((prev) => [newOrder, ...prev]);
      console.log(newOrder);
    };

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

    socket.on("new-order", handleNewOrder);
    socket.on("order-assigned", handleOrderAssigned);
    // return () => {
    //   socket.off("order-assigned", handleOrderAssigned);
    // };

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("order-assigned", handleOrderAssigned);
    };
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
  // useEffect(() => {
  //   const socket = getSocket();
  //   const handleOrderAssigned = (data: {
  //     orderId: string;
  //     assignedDeliveryBoy: User;
  //   }) => {
  //     setAllOrders((prev) =>
  //       prev.map((order) =>
  //         order._id?.toString() === data.orderId
  //           ? { ...order, assignedDeliveryBoy: data.assignedDeliveryBoy }
  //           : order,
  //       ),
  //     );
  //   };
  //   socket.on("order-assigned", handleOrderAssigned);
  //   return () => {
  //     socket.off("order-assigned", handleOrderAssigned);
  //   };
  // }, []);

  return (
    <div>
      <p>My Orders</p>
      <div>
        {allOrders?.map((order) => (
          <div
            key={order._id?.toString()}
            className="p-4 border rounded-lg mb-4"
          >
            <h3 className="font-bold text-lg">
              Order #{order._id?.toString()}
            </h3>

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
              </div>
            )}
            {/* Address */}
            <div className="mt-2">
              <p>
                <strong>Address:</strong> {order.address.fullAddress}
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

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id!.toString(), e.target.value)
              }
            >
              {status.map((status, id) => (
                <option key={id} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
