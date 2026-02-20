import {
    BikeIcon,
    ChefHatIcon,
    UserCogIcon,
    UserIcon
} from "lucide-react";

export const roleLists = [
  {
    id: "admin",
    label: "Admin",
    icon: UserCogIcon,
    description: "Manage platform, users, and operations",
  },
  {
    id: "customer",
    label: "Customer",
    icon: UserIcon,
    description: "Order food from restaurants",
  },
  {
    id: "delivery_partner",
    label: "Delivery Partner",
    icon: BikeIcon,
    description: "Deliver orders and earn money",
  },
//   {
//     id: "restaurant",
//     label: "Restaurant",
//     icon: ChefHatIcon,
//     description: "List your menu and accept orders",
//   },
];