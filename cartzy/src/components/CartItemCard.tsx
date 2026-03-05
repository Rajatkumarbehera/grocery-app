import {
    CartItem,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
} from "@/redux/cartSlice";
import { AppDispatch } from "@/redux/store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import cartzy from "../../public/cartzy1.png";
import { Card } from "./ui/card";

export default function CartItemCard({ item }: { item: CartItem }) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Card className="group relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-100">
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
        {/* <div className="text-center">
          <p className="text-green-600 font-medium text-sm">
            Save &#8377;{item.price - 50}
          </p>
        </div> */}
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
    </Card>
  );
}
