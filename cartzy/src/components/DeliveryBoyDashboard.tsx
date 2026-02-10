"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import AssignmentCard from "./AssignmentCard";
import { getSocket } from "@/lib/socket";
import mongoose from "mongoose";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LiveMap from "./LiveMap";
import DeliveryChat from "./DeliveryChat";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Order {
  _id: mongoose.Types.ObjectId;
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
  createdAt: string;
}

interface Assignment {
  _id: string;
  order: Order;
  broadcastedTo: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

export default function DeliveryBoyDashboard({ earning }: { earning: number }) {
  const { userData } = useSelector((state: RootState) => state.user);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showOTPBox, setShowOTPBox] = useState(false);
  const [deliveryOTP, setDeliveryOTP] = useState("");

  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  console.log(earning);
  

  useEffect(() => {
    const socket = getSocket();
    socket.on("update-deliveryboy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });

    return () => {
      socket.off("update-deliveryboy-location");
    };
  }, []);

  const fetchAssignmnets = async () => {
    try {
      const result = await axios.get("/api/delivery-partner/get-assignments");
      console.log(result.data);
      setAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssignmnets();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleNewAssignment = (data: Assignment) => {
      setAssignments((prev) => [...prev, data]);
    };

    socket.on("new-assignment", handleNewAssignment);

    return () => {
      socket.off("new-assignment", handleNewAssignment);
    };
  }, []);

  const handleAcceptOrder = async (assignmentId: string) => {
    try {
      const result = await axios.get(
        `/api/delivery-partner/assignment/${assignmentId}/accept-assignment`,
      );
      fetchCurrentOrder();
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery-partner/current-order");
      console.log(result.data);
      if (result.data.active) {
        setActiveOrder(result.data.assignment);
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
  }, [userData]);

  useEffect(() => {
    let socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });
        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  const sendOTP = async () => {
    try {
      const result = await axios.post("/api/delivery-partner/otp/send", {
        orderId: activeOrder.order._id,
      });
      console.log(result.data);
      setShowOTPBox(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOTP = async () => {
    try {
      const result = await axios.post("/api/delivery-partner/otp/verify", {
        orderId: activeOrder.order._id,
        OTP: deliveryOTP,
      });
      console.log(result.data);
      setActiveOrder(null);
      // setAssignments((prev) => prev.filter((a) => a._id !== activeOrder._id));
      setAssignments([]);

      fetchCurrentOrder();
      fetchAssignmnets();
      // fetchCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  if (!activeOrder && assignments.length === 0) {
    const todaysEarning = [
      {
        name: "Today",
        earning,
        deliveries: earning / 40,
      },
    ];
    return (
      <div>
        <p>No active deliveries</p>
        <h1>Todays's performance</h1>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={todaysEarning}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="earnings" name="Earnings" />
            <Bar dataKey="deliveries" name="Deliveries" />
          </BarChart>
        </ResponsiveContainer>
        <p>{earning || 0} earned Today</p>
        <button
          className="bg-green-500 px-4 py-1 rounded-sm"
          onClick={() => window.location.reload()}
        >
          Refresh Earning
        </button>
      </div>
    );
  }

  if (activeOrder && userLocation) {
    return (
      <div>
        <p className="text-green-500 font-bold">
          Active Order #{activeOrder.order._id.slice(-6)}
        </p>
        <div className="border-t h-[300px] relative overflow-hidden border mt-6">
          <LiveMap
            userLocation={userLocation}
            deliveryBoyLocation={deliveryBoyLocation}
          />
        </div>
        <DeliveryChat
          orderId={activeOrder.order._id}
          deliveryBoyId={userData?._id!}
        />
        {!activeOrder.order.deliveryOTPVerification && !showOTPBox && (
          <button
            className="bg-green-500 px-2 py-1 rounded-sm text-sm text-white cursor-pointer"
            onClick={sendOTP}
          >
            Marked as Delivered
          </button>
        )}

        {showOTPBox && (
          <div>
            <input
              type="text"
              className="w-full py-3 border rounded-lg text-center"
              placeholder="Enter OTP"
              maxLength={4}
              value={deliveryOTP}
              onChange={(e) => setDeliveryOTP(e.target.value)}
            />
            <button
              className="bg-green-500 px-2 py-1 rounded-sm text-sm text-white cursor-pointer"
              onClick={verifyOTP}
            >
              Verify OTP
            </button>
          </div>
        )}

        {activeOrder.order.deliveryOTPVerification && (
          <div className="text-green-500">Delivered</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <p>DeliveryDashboard</p>
      {assignments.map((assignment, index) => (
        <AssignmentCard
          key={index}
          item={assignment}
          handleAcceptOrder={handleAcceptOrder}
        />
      ))}
    </div>
  );
}
