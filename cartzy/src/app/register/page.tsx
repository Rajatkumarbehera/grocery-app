"use client";

import RegisterForm from "@/components/RegisterForm";
import Welcome from "@/components/Welcome";
import { useState } from "react";

export default function Register() {
  const [isWelcome, setIsWelcome] = useState(true);
  return (
    <div>
      {isWelcome ? (
        <Welcome setIsWelcome={setIsWelcome} />
      ) : (
        <RegisterForm setIsWelcome={setIsWelcome} />
      )}
    </div>
  );
}
