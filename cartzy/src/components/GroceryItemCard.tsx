"use client";

import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { GroceryClient } from "@/types/grocery";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

export default function GroceryItemCard({ item }: { item: GroceryClient }) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);

  console.log(cartData);

  const cartItem = cartData.find((i) => i._id === item._id);

  return (
    <div className="border border-dashed flex flex-col">
      <div>{item.name}</div>
      {item.image ? (
        <Image src={item.image} alt={item.name} width={200} height={200} />
      ) : null}
      <div>{item.category}</div>
      <div>
        {item.price} / {item.unit}
      </div>
      {!cartItem ? (
        <button
          className="flex items-center justify-center cursor-pointer p-1 gap-2 border rounded-full bg-green-400 text-white"
          onClick={() => dispatch(addToCart(item))}
        >
          Add to Cart <ShoppingCart className="h-5 w-5" />
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center cursor-pointer p-1 gap-2 border rounded-full bg-green-400 text-white"
            onClick={() => dispatch(decreaseQuantity(item._id))}
          >
            <Minus className="h-5 w-5" />
          </button>
          <p>{cartItem.quantity}</p>
          <button
            className="flex items-center justify-center cursor-pointer p-1 gap-2 border rounded-full bg-green-400 text-white"
            onClick={() => dispatch(increaseQuantity(item._id))}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
