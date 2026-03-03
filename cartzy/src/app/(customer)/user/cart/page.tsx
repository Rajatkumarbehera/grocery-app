"use client";

import CartItemCard from "@/components/CartItemCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  clearCart
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  ArrowRight,
  ShoppingBag,
  Trash2Icon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import cartzy from "../../../../../public/cartzy1.png";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center">
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
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag className="w-7 h-7 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          My Cart
        </h1>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 font-semibold text-xs px-3 py-0.5 rounded-full"
        >
          {cartData.length} {cartData.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {cartData.map((item, index) => (
              <CartItemCard key={index} item={item} />
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => dispatch(clearCart())}
              className="bg-white hover:text-red-500 hover:bg-white text-gray-800 font-medium text-base flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Trash2Icon className="w-4 h-4" />
              Remove all
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm sticky top-24">
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            </CardHeader>

            <CardContent>
              <div className="space-y-3.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span
                    className={cn(
                      "font-medium",
                      deliveryFee === 0 ? "text-green-500" : "text-gray-900",
                    )}
                  >
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-500 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                    Add ₹{500 - subTotal} more for free delivery
                  </p>
                )}
                <Separator className="my-1" />
                <div className="flex justify-between font-bold text-base text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600 text-lg">₹{finalTotal}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                disabled={subTotal < 500}
                onClick={() => router.push("/user/checkout")}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-10 font-semibold text-base shadow-sm shadow-green-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-center text-xs text-gray-400">
                Secure checkout · Free returns
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
