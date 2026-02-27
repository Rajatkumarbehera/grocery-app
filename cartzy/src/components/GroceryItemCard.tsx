"use client";

import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { GroceryClient } from "@/types/grocery";
import { Check, Minus, Plus, ShoppingCart, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import cartzy from "../../public/cartzy1.png";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

export default function GroceryItemCard({ item }: { item: GroceryClient }) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i._id === item._id);
  return (
    <Card
      className={`pt-0 pb-3 gap-0 rounded-2xl overflow-hidden border-0 shadow-sm ring-1 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        cartItem
          ? "ring-green-400 shadow-green-100"
          : "ring-gray-200 hover:ring-gray-300"
      }`}
    >
      <div className="relative w-full aspect-square flex items-center justify-center bg-linear-to-br from-gray-50 to-green-50/30 overflow-hidden group cursor-pointer">
        {/* Discount badge — optional, add a discount field if needed */}
        {/* <span className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Fresh
        </span> */}

        {cartItem && (
          <span className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full p-0.5">
            <Check className="w-3 h-3" />
          </span>
        )}

        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-7 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
          />
        ) : (
          <Image
            src={cartzy}
            alt="cartzy"
            height={230}
            width={230}
            className="opacity-40 scale-75"
          />
        )}
      </div>

      <CardContent className="flex flex-col gap-1.5 px-3">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 capitalize h-10 overflow-hidden">
          {item.name} : 1 <span className="lowercase">{item.unit}</span>
        </p>
        <div className="flex items-baseline gap-1">
          <p className="text-base font-bold text-green-600">
            &#8377;{item.price}
          </p>
          <span className="text-xs text-gray-400 font-normal">
            / {item.unit}
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-3 pt-2 pb-0">
        {!cartItem ? (
          <Button
            size="sm"
            className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white text-xs rounded-xl cursor-pointer uppercase tracking-wide font-semibold transition-all duration-150 shadow-sm shadow-green-200"
            onClick={() => dispatch(addToCart(item))}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
            Add to cart
          </Button>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center justify-between flex-1 bg-green-50 ring-1 ring-green-200 rounded-xl overflow-hidden">
              <Button
                size="sm"
                className="rounded-xl rounded-r-none bg-transparent hover:bg-green-100 text-green-600 shadow-none cursor-pointer transition-colors"
                onClick={() => dispatch(decreaseQuantity(item._id))}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-bold text-green-700 min-w-5 text-center">
                {cartItem.quantity}
              </span>
              <Button
                size="sm"
                className="rounded-xl rounded-l-none bg-transparent hover:bg-green-100 text-green-600 shadow-none cursor-pointer transition-colors"
                onClick={() => dispatch(increaseQuantity(item._id))}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <Button
              size="sm"
              className="bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 border-0 rounded-sm cursor-pointer transition-colors shrink-0"
              onClick={() => dispatch(removeFromCart(item._id))}
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
