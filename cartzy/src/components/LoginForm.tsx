"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";

export default function LoginForm() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // console.log(session);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters!");
      return;
    }

    setError("");

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-linear-to-br from-green-50 to-yellow-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-green-100 animate-fade-in-down"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to continue shopping with{" "}
          <span className="text-green-700 font-semibold">Cartzy</span>
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-green-500">
            <Mail className="text-gray-500 h-5 w-5" />
            <input
              type="email"
              className="flex-1 outline-none px-3"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-green-500">
            <Lock className="text-gray-500 h-5 w-5" />
            <input
              type={showPass ? "text" : "password"}
              className="flex-1 outline-none px-3"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPass ? (
              <EyeOff
                className="cursor-pointer text-gray-600"
                onClick={() => setShowPass(false)}
              />
            ) : (
              <Eye
                className="cursor-pointer text-gray-600"
                onClick={() => setShowPass(true)}
              />
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">{error}</p>
        )}

        {/* <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mt-4 rounded-lg transition-all duration-200 shadow-md"
        >
          Login
        </button> */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mt-4 rounded-lg transition-all duration-200 shadow-md"
        >
          Login
        </Button>
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>

        <Button
          type="button"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 mt-4 rounded-lg transition-all duration-200 shadow-md cursor-pointer"
          onClick={() => signIn("google", { redirectTo: "/" })}
        >
          {" "}
          Continue with Google
        </Button>

        {/* <button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 mt-4 rounded-lg transition-all duration-200 shadow-md cursor-pointer"
          onClick={() => signIn("google", { redirectTo: "/" })}
        >
          Continue with Google
        </button> */}
      </form>
    </div>
  );
}
