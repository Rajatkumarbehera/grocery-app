import Link from "next/link";

export default function OrderSuccesspage() {
  return (
    <div>
      <p>Order Placed Successfully</p>
      <Link href={"/user/my-order"}>
        <button className="cursor-pointer bg-green-500 text-white px-4 py-1">Go To My Orders Page</button>
      </Link>
    </div>
  );
}
