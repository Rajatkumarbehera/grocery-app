"use client";

import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import cartzy from "../../../../../public/cartzy1.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );
  console.log(cartData);

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16">
        <Image
          src={cartzy}
          alt="cartzy"
          height={230}
          width={230}
          className="opacity-60"
        />
        <div className="flex flex-col items-center gap-4">
          <div>
            <p className="text-lg text-gray-500">No items in your cart</p>
            <p className="text-gray-400">
              Browse from our wide variety of products & exciting offers
            </p>
          </div>
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md cursor-pointer active:scale-95 uppercase">
              Start shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      My Cart{" "}
      {cartData?.length > 0 &&
        `(${cartData.length} item${cartData.length > 1 ? "s" : ""})`}{" "}
      <div className="flex justify-between">
        <div>
          {cartData.map((item: any, index: number) => (
            <div
              key={index}
              className="border border-dashed flex items-center justify-between"
            >
              <div>
                <div>{item.name}</div>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                  />
                ) : null}
                <div>{item.category}</div>
                <div>
                  {Number(item.quantity * item.price)} / {item.unit}
                </div>
              </div>
              <div className="flex items-center flex-col gap-2">
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center justify-center cursor-pointer p-1 gap-2 border rounded-full bg-green-400 text-white"
                    onClick={() => dispatch(decreaseQuantity(item._id))}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <p>{item.quantity}</p>
                  <button
                    className="flex items-center justify-center cursor-pointer p-1 gap-2 border rounded-full bg-green-400 text-white"
                    onClick={() => dispatch(increaseQuantity(item._id))}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <Trash2
                  className="h-5 w-5 text-red-500 cursor-pointer"
                  onClick={() => dispatch(removeFromCart(item._id))}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <p>Order Summary</p>
          <div>
            <p>SubTotal: {subTotal}</p>
            <p>Delivery Fee: {deliveryFee}</p>
            <p>Total: {finalTotal}</p>
          </div>
          <button
            className="text-white bg-green-500 px-6 py-1 rounded-full cursor-pointer"
            onClick={() => router.push("/user/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
