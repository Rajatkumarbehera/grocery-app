import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import CustomerDashboard from "@/components/CustomerDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams);

  await connectDB();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  console.log(user);

  if (!user) {
    redirect("/login");
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "customer");
  // console.log(inComplete);

  if (inComplete) {
    return <EditRoleMobile />;
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
