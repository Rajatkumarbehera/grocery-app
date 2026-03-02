import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import CustomerDashboard from "@/components/CustomerDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import connectDB from "@/lib/db";
import { serializeUser } from "@/lib/serialize";
import User from "@/models/user.model";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email }).lean();
  const serializedUser = serializeUser(user);

  // if (!serializedUser) {
  //   redirect("/login");
  // }

  // const inComplete = !serializedUser?.mobile || !serializedUser?.role;
  // if (inComplete) {
  //   const adminExists = await checkAdminExists();
  //   return <OnboardingForm adminExists={!!adminExists} />;
  // }

  return (
    <div>
      {/* <GeoUpdater userId={serializedUser?._id} /> */}
      {serializedUser?.role === "admin" ? (
        <AdminDashboard />
      ) : serializedUser?.role === "delivery_partner" ? (
        <DeliveryBoy />
      ) : (
        <CustomerDashboard />
      )}
    </div>
  );
}
