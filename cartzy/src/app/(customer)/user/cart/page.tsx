"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Trash2Icon,
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
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-100"
              >
                <div className="flex items-center justify-between gap-20">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          src={cartzy}
                          alt="cartzy"
                          fill
                          className="object-cover opacity-40"
                        />
                      )}
                    </div>

                    <div className="min-w-70">
                      <h3 className="font-medium text-gray-700 line-clamp-2 text-sm capitalize">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-green-600 font-medium text-sm">
                        Pay ₹{item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 font-medium text-sm">
                      Save &#8377;{item.price - 50}
                    </p>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-1 py-1 border border-gray-100">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item._id))}
                        className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item._id))}
                        className="w-7 h-7 rounded-full bg-green-500 shadow-sm flex items-center justify-center text-white hover:bg-green-600 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-50 rounded-sm transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
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
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

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

            <Button
              disabled={subTotal < 500}
              onClick={() => router.push("/user/checkout")}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full h-10 font-semibold text-base shadow-sm shadow-green-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Secure checkout · Free returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
