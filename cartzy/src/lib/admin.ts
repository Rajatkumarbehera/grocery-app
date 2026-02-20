import connectDB from "@/lib/db";
import User from "@/models/user.model";

export async function checkAdminExists() {
  await connectDB();
  const adminExists = await User.exists({ role: "admin" });
  return !!adminExists;
}
