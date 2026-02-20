import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import CustomerDashboard from "@/components/CustomerDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import { checkAdminExists } from "@/lib/admin";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import OnboardingForm from "./forms/OnboardingForm";

export default async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams);

  await connectDB();
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email });

  if (!user) {
    redirect("/login");
  }

  const inComplete = !user.mobile || !user.role;
  if (inComplete) {
    const adminExists = await checkAdminExists();
    return <OnboardingForm adminExists={!!adminExists} />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  let groceryList: Grocery[] = [];

  if (user.role === "customer") {
    if (searchParams.q) {
      groceryList = await Grocery.find({
        $or: [
          {
            name: {
              $regex: searchParams.q || "",
              $options: "i",
            },
          },
          {
            category: {
              $regex: searchParams.q || "",
              $options: "i",
            },
          },
        ],
      });
    } else {
      groceryList = await Grocery.find({});
    }
  }

  return (
    <div>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {user.role === "customer" ? (
        <CustomerDashboard groceryList={groceryList} />
      ) : user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer />
    </div>
  );
}
