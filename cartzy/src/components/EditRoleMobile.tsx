"use client";

import axios from "axios";
import { Bike, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type RoleOption = {
  id: string;
  label: string;
  icon: React.ElementType;
};

export default function EditRoleMobile() {
  const [roles, setRoles] = useState([
    { id: "customer", label: "Customer", icon: User },
    { id: "delivery_partner", label: "Delivery Partner", icon: Bike },
    { id: "admin", label: "Admin", icon: Bike },
  ]);

  // const [adminExist, setAdminExist] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();
  const { update } = useSession();

  const handleClick = async () => {
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      await update({ role: selectedRole });
      console.log(result.data);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
    // console.log(mobile + " " + selectedRole);
  };

  // API to check if admin is present in the application
  const checkForAdmin = async () => {
    try {
      const result = await axios.get("/api/check-for-admin");
      console.log(result);
      if (result.data.adminExist) {
        setRoles((prev) => prev.filter((r) => r.id !== "admin"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkForAdmin();
  }, []);

  return (
    <div>
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = role.id === selectedRole;

        console.log(isSelected);

        return (
          <div
            key={role.id}
            className={`${
              isSelected ? "border-green-500" : "border-black-500"
            } border`}
            onClick={() => setSelectedRole(role.id)}
          >
            <Icon />
            <span>{role.label}</span>
          </div>
        );
      })}
      <input
        type="tel"
        className="border"
        onChange={(e) => setMobile(e.target.value)}
        value={mobile}
      />
      <button
        className="border"
        disabled={mobile.length !== 10 || !selectedRole}
        onClick={handleClick}
      >
        Go To Home
      </button>
    </div>
  );
}
