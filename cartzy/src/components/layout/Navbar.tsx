import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { serializeUser } from "@/lib/serialize";
import User from "@/models/user.model";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  await connectDB();
  const session = await auth();

  const user = await User.findOne({ email: session?.user?.email }).lean();
  const serializedUser = serializeUser(user);

  return <NavbarClient user={serializedUser} />;
}
