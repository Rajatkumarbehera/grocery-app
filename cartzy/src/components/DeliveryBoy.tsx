import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import DeliveryBoyDashboard from "./DeliveryBoyDashboard";

export default async function DeliveryBoy() {
  await connectDB();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;
  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOTPVerification: true,
  });

  const today = new Date().toDateString();
//   const todayOrders1 = orders.filter(
//     (o) => new Date(o.deliveredAt).toString() === today,
//   );
//   console.log(todayOrders1);
  
  const todayOrders = orders.filter(
    (o) => new Date(o.deliveredAt).toDateString() === today,
  ).length;
  const todaysEarning = todayOrders * 40;
  
  console.log(today);
  console.log(todayOrders);
  console.log(todaysEarning);

  return (
    <div>
      <DeliveryBoyDashboard earning={todaysEarning} />
    </div>
  );
}
