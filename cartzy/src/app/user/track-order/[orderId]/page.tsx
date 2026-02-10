"use client";
import LiveMap from "@/components/LiveMap";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import { User } from "@/types/user";
import axios from "axios";
import mongoose from "mongoose";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

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

interface Location {
  latitude: number;
  longitude: number;
}

interface Message {
  _id?: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  text: string;
  senderId: mongoose.Types.ObjectId;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function TrackOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order>();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState([
    // "Hi",
    // "Hello",
    // "Hey",
    // "Thank you",
    // "Welcome",
  ]);
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOrder = async () => {
    try {
      const result = await axios.get(`/api/user/get-order/${orderId}`);
      console.log(result.data);
      setOrder(result.data);
      setUserLocation({
        latitude: result.data.address.latitude,
        longitude: result.data.address.longitude,
      });
      setDeliveryBoyLocation({
        latitude: result.data.assignedDeliveryBoy.location.coordinates[1],
        longitude: result.data.assignedDeliveryBoy.location.coordinates[0],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrder();
  }, [userData?._id]);

  console.log(order);

  useEffect(() => {
    const socket = getSocket();
    socket.on("update-deliveryboy-location", ({ userId, location }) => {
      if (userId === order?.assignedDeliveryBoy?._id) {
        setDeliveryBoyLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        });
      }
    });

    return () => {
      socket.off("update-deliveryboy-location");
    };
  }, [order]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
    socket.on("send-message", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev!, message]);
      }
    });
    return () => {
      socket.off("send-message");
    };
  }, []);

  const handleSendMessage = async () => {
    const socket = getSocket();
    const message = {
      roomId: orderId,
      text: newMessage,
      senderId: userData?._id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);

    setNewMessage("");
  };

  const getAllMessages = async () => {
    try {
      const result = await axios.post("/api/chat/messages", {
        roomId: orderId,
      });
      setMessages(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMessages();
  }, []);

  const getSuggestions = async () => {
    try {
      const latestMessage = messages
        ?.filter((m) => m.senderId !== userData?._id)
        ?.at(-1);
      const result = await axios.post("/api/chat/ai-suggestions", {
        message: latestMessage?.text,
        role: "user",
      });

      setSuggestions(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="cursor-pointer" onClick={() => router.back()}>
        Back
      </button>
      <p className="text-green-500 font-bold">
        Order #{order?._id?.toString().slice(-6)}
      </p>
      <p className="text-green-500 font-bold">{order?.status}</p>
      <div className="border-t h-[300px] relative overflow-hidden border mt-6">
        <LiveMap
          userLocation={userLocation}
          deliveryBoyLocation={deliveryBoyLocation}
        />
      </div>
      <div className="mt-4 border rounded-lg h-[400px] flex flex-col">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between">
            <span>Quick replies</span>
            <button
              className="bg-yellow-300 text-sm px-2 py-1 rounded-lg cursor-pointer"
              onClick={getSuggestions}
            >
              AI suggest
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-purple-600 text-white text-xs px-2 py-1 rounded-sm cursor-pointer"
                onClick={() => setNewMessage(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {messages?.map((message) => (
            <div
              key={message._id?.toString()}
              className={`flex text-sm ${message.senderId === userData?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm shadow ${message.senderId === userData?._id ? "bg-green-300 rounded-br-none" : "bg-blue-300 rounded-bl-none"}`}
              >
                <p>{message.text}</p>
                <p className="text-right">{message.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            placeholder="Send message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
          />
          <button
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
