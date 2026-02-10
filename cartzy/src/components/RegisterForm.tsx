"use client";

import axios from "axios";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RegisterFormProps = {
  setIsWelcome: (value: boolean) => void;
};

export default function RegisterForm({ setIsWelcome }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters!");
      return;
    }

    setError("");

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (res.status === 200) {
        router.push("/login");
        console.log(res.data);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Try again!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-green-50 to-yellow-50 p-6 relative">
      <button
        onClick={() => setIsWelcome(true)}
        className="absolute top-6 left-6 flex items-center gap-1 text-green-700 hover:text-green-900 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-green-100 animate-fade-in-down"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Create Your Account
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-green-500">
            <User className="text-gray-500 h-5 w-5" />
            <input
              type="text"
              className="flex-1 outline-none px-3"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

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
              placeholder="At least 6 characters"
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

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mt-4 rounded-lg transition-all duration-200 shadow-md"
        >
          Register
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
        <button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 mt-4 rounded-lg transition-all duration-200 shadow-md cursor-pointer"
          onClick={() => signIn("google", { redirectTo: "/" })}
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}
