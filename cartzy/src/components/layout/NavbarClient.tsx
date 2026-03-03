"use client";

import { RootState } from "@/redux/store";
import { UserClient } from "@/types/user";
import {
  LogOutIcon,
  SearchIcon,
  ShoppingBag,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cartzy from "../../../public/cartzy1.png";
import { AnimatedPlaceholder } from "../AnimatedPlaceholder";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

interface NavbarProps {
  user: UserClient | null;
}

export default function NavbarClient({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const { cartData, subTotal } = useSelector((state: RootState) => state.cart);
  const isCheckoutPath = pathname === "/user/checkout";
  console.log(cartData);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) {
      router.push("/");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <nav className="container mx-auto flex h-18 items-center justify-between px-10">
        <div className="flex items-center gap-6">
          {" "}
          <Link
            href="/"
            className="text-2xl font-bold text-green-600 flex items-center"
          >
            <Image src={cartzy} alt="cartzy" height={52} width={52} />
            <span className="text-2xl font-black tracking-tight bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              cartzy
            </span>
          </Link>
          {!isCheckoutPath &&
            user?.role !== "admin" &&
            user?.role !== "delivery_partner" && (
              <form onSubmit={handleSearch}>
                <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-input">
                  <InputGroupAddon align="inline-start">
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="search"
                    className="w-[350px] "
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  <AnimatedPlaceholder show={search === ""} />
                </InputGroup>
              </form>
            )}
          {user?.role === "admin" && (
            <div className="flex items-center gap-2">
              <Link href={"/admin/add-grocery"}>Add Grocery</Link> |
              <Link href={"/admin/view-grocery"}>View Grocery</Link> |
              <Link href={"/admin/manage-order"}>Manage Orders</Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!user && (
            <Link href="/login">
              <Button
                variant="link"
                className="bg-white hover:bg-white cursor-pointer"
              >
                <UserIcon className="size-5 text-green-500" />
                Sign In/Register
              </Button>
            </Link>
          )}

          {!isCheckoutPath &&
            user?.role !== "admin" &&
            user?.role !== "delivery_partner" && (
              <Link href="/user/cart">
                <Button
                  variant="link"
                  className="relative cursor-pointer h-10 w-10"
                >
                  <ShoppingCartIcon className="size-5" />
                  <>
                    <span className="absolute top-0 right-0 flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                      {cartData?.length > 0 ? cartData.length : 0}
                    </span>
                    <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 text-xs">
                      &#8377;{cartData?.length > 0 ? subTotal : 0}
                    </span>
                  </>
                </Button>
              </Link>
            )}

          {!isCheckoutPath && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.image || ""} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        {user?.name}
                        {user?.role === "admin" && (
                          <span className="capitalize text-red-400">
                            ({user?.role})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/user/profile">
                      <UserIcon className="mr-2" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/my-order" className="cursor-pointer">
                      <ShoppingBag className="mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="cursor-pointer"
                  >
                    <LogOutIcon className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}
