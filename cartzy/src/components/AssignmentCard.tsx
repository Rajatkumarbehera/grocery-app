import mongoose from "mongoose";

interface Order {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    city: string;
    state: string;
    pincode: string;
    mobile: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out of delivery" | "delivered";
  createdAt: string;
}

interface Assignment {
  _id: string;
  order: Order;
  broadcastedTo: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function AssignmentCard({
  item,
  handleAcceptOrder,
}: {
  item: Assignment;
  handleAcceptOrder: (assignmentId: string) => void | Promise<void>;
}) {
  return (
    <div>
      <p>Cards</p>
      <div className="border px-2 py-1">
        <p>OrderId #{item.order._id.toString().slice(-6)}</p>
        <p>{item.order.address.fullAddress}</p>
        {/* <p>Name: {item.order.address.fullName}</p>
        <p>Number: {item.order.address.mobile}</p>
        <p>Method: {item.order.paymentMethod}</p>
        <p>Amount: {item.order.totalAmount}</p>
        <p>Status: {item.order.status}</p> */}
        <div className="mt-2 flex gap-2">
          <button
            className="bg-green-500 px-2 py-1"
            onClick={() => handleAcceptOrder(item._id)}
          >
            Accept
          </button>
          <button className="bg-red-500 px-2 py-1">Reject</button>
        </div>
      </div>
      {/* {item?.order.address.fullAddress} */}
    </div>
  );
}
