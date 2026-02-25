"use client";

import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { GroceryClient } from "@/types/grocery";
import { Minus, Plus, ShoppingCart, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

export default function GroceryItemCard({ item }: { item: GroceryClient }) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i._id === item._id);
  return (
    <Card className="pt-0 pb-2 gap-0 rounded-xs border border-gray-300">
      <div className="relative w-full aspect-square flex items-center justify-center">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-10"
          />
        ) : (
          <ShoppingCart className="h-32 w-32 text-gray-300" />
        )}
      </div>

      <CardContent className="flex flex-col gap-1 px-3">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight capitalize">
          {item.name}
        </p>
        <p className="text-sm font-bold text-green-600">
          &#8377;{item.price}{" "}
          <span className="text-xs text-gray-400 font-normal">
            / {item.unit}
          </span>
        </p>
      </CardContent>

      <CardFooter className="px-3 mt-4">
        {!cartItem ? (
          <Button
            size={"sm"}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-sm rounded-xs cursor-pointer uppercase"
            onClick={() => dispatch(addToCart(item))}
          >
            <ShoppingCart />
            Add to cart
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full gap-10">
            <div className="flex items-center justify-between w-full border rounded-xs">
              <Button
                size={"sm"}
                className="rounded-xs bg-green-500 hover:bg-green-600 text-white rounded-r-none cursor-pointer"
                onClick={() => dispatch(decreaseQuantity(item._id))}
              >
                <Minus />
              </Button>
              <span className="text-sm">{cartItem.quantity}</span>
              <Button
                size={"sm"}
                className="rounded-xs bg-green-500 hover:bg-green-600 text-white rounded-l-none cursor-pointer"
                onClick={() => dispatch(increaseQuantity(item._id))}
              >
                <Plus />
              </Button>
            </div>
            <div>
              <Button
                size={"sm"}
                className=" bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 rounded-xs cursor-pointer"
                // onClick={() => dispatch(increaseQuantity(item._id))}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
