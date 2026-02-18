"use client";

import { RootState } from "@/redux/store";
import { UserClient } from "@/types/user";
import { LogOut, ShoppingCart, User2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

interface NavbarProps {
  user: UserClient;
}

export default function Navbar({ user }: NavbarProps) {
  console.log(user);
  
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { cartData } = useSelector((state: RootState) => state.cart);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.toLowerCase();

    if (!q) {
      return;
    }
    router.push(`/?q=${encodeURIComponent(q)}`);
    setSearch("");
    // setFiltered(
    //   groceries?.filter(
    //     (g) =>
    //       g.name.toLowerCase().includes(q) ||
    //       g.category.toLowerCase().includes(q),
    //   ),
    // );
  };

  return (
    <div className="flex items-center justify-evenly mt-4">
      {user.role === "customer" && (
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="border"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Link href={"/user/cart"} className="flex">
            <ShoppingCart />
            <span>{cartData?.length}</span>
          </Link>
        </form>
      )}
      {user.role === "admin" && (
        <div className="flex items-center gap-2">
          <Link href={"/admin/add-grocery"}>Add Grocery</Link> |
          <Link href={"/admin/view-grocery"}>View Grocery</Link> |
          <Link href={"/admin/manage-order"}>Manage Orders</Link>
        </div>
      )}
      <div>
        {user?.image ? (
          <Image src={user?.image} alt="user" width={24} height={24} />
        ) : (
          <User2 />
        )}
      </div>
      <div
        className="flex cursor-pointer"
        onClick={() => signOut({ redirectTo: "/login" })}
      >
        <LogOut />
        Log out
      </div>
    </div>
  );
}
