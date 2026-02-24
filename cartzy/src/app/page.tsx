import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import CustomerDashboard from "@/components/CustomerDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import { checkAdminExists } from "@/lib/admin";
import connectDB from "@/lib/db";
import { serializeGroceries, serializeUser } from "@/lib/serialize";
import Grocery from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import OnboardingForm from "./forms/OnboardingForm";

export default async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q?.toLowerCase() || "";

  await connectDB();
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email }).lean();
  const serializedUser = serializeUser(user);

  if (!serializedUser) {
    redirect("/login");
  }

  const inComplete = !serializedUser.mobile || !serializedUser.role;
  if (inComplete) {
    const adminExists = await checkAdminExists();
    return <OnboardingForm adminExists={!!adminExists} />;
  }

  const filter = query
    ? {
        $or: [
          {
            name: {
              $regex: query,
              $options: "i",
            },
          },
          {
            category: {
              $regex: query,
              $options: "i",
            },
          },
        ],
      }
    : {};

  const groceries = await Grocery.find(filter).lean();
  const serializedGroceries = serializeGroceries(groceries);

  return (
    <div>
      <Navbar user={serializedUser} />
      <GeoUpdater userId={serializedUser?._id} />
      {serializedUser.role === "customer" ? (
        <Suspense fallback={<div>Loading...</div>}>
          <CustomerDashboard groceries={serializedGroceries} />
        </Suspense>
      ) : serializedUser.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer />
    </div>
  );
}
