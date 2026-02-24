import { GroceryClient, GroceryDocument } from "@/types/grocery";
import { UserClient, UserDocument } from "@/types/user";

export function serializeUser(user: UserDocument | null): UserClient | null {
  if (!user) return null;

  return {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function serializeUsers(users: UserDocument[]): UserClient[] {
  return users.map(serializeUser).filter((u): u is UserClient => u !== null);
}

export function serializeGrocery(
  grocery: GroceryDocument | null,
): GroceryClient | null {
  if (!grocery) return null;

  return {
    ...grocery,
    _id: grocery?._id?.toString(),
    createdAt: grocery.createdAt?.toISOString(),
    updatedAt: grocery.updatedAt?.toISOString(),
  };
}

export function serializeGroceries(
  groceries: GroceryDocument[],
): GroceryClient[] {
  return groceries
    .map(serializeGrocery)
    .filter((g): g is GroceryClient => g !== null);
}
