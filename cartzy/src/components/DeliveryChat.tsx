import { getSocket } from "@/lib/socket";
import axios from "axios";
import mongoose from "mongoose";
import { useEffect, useRef, useState } from "react";

interface Chat {
  orderId: mongoose.Types.ObjectId;
  deliveryBoyId: mongoose.Types.ObjectId;
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

export default function DeliveryChat({ orderId, deliveryBoyId }: Chat) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>();
  const [suggestions, setSuggestions] = useState([
    // "Hi",
    // "Hello",
    // "Hey",
    // "Thank you",
    // "Welcome",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      senderId: deliveryBoyId,
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
        ?.filter((m) => m.senderId !== deliveryBoyId)
        ?.at(-1);
      const result = await axios.post("/api/chat/ai-suggestions", {
        message: latestMessage?.text,
        role: "delivery_partner",
      });

      setSuggestions(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
            className={`flex text-sm ${message.senderId === deliveryBoyId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-3 py-2 rounded-lg text-sm shadow ${message.senderId === deliveryBoyId ? "bg-green-300 rounded-br-none" : "bg-blue-300 rounded-bl-none"}`}
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
  );
}
