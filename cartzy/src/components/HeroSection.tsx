"use client";

// import { getSocket } from "@/lib/socket";
// import { RootState } from "@/redux/store";
import { Leaf, Truck } from "lucide-react";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";

export default function HeroSection() {
  // const { userData } = useSelector((state: RootState) => state.user);

  // console.log("userdata", userData);

  const slides = [
    {
      id: 1,
      icon: <Leaf />,
      title: "Fresh Organic Groceries",
      subtitle:
        "Farm-fresh fruits, vegetables and daily essentials delivered to you.",
      btnText: "Shop Now",
    },
    {
      id: 2,
      icon: <Truck />,
      title: "Fast and reliable Delivery",
      subtitle: "We ensure your groceries reach your doorstep in no time.",
      btnText: "Order Now",
    },
  ];

  // useEffect(() => {
  //   if (userData) {
  //     let socket = getSocket();
  //     socket.emit("chat", userData?._id);
  //   }
  // }, [userData]);
  return <div>HeroSection Carousel</div>;
}
