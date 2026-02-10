import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="bg-green-900 px-20 py-8 text-white flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl underline">Quick Links</h2>
          <div className="list-none">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/user/cart">Cart</Link>
            </li>
            <li>
              <Link href="/user/my-order">My orders</Link>
            </li>
          </div>
        </div>
        <div>
          <h2 className="text-xl underline">More Info</h2>
          <div className="list-none">
            <li>Marathalli, Bengaluru</li>
            <li>+91 8786868890</li>
            <li>support@cartzy.in</li>
          </div>
        </div>
        <div>
          <h2 className="text-xl underline">Social links</h2>
          <div className="list-none">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Youtube</li>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex items-center justify-between">
        <p>All rights reserved 2026</p>
        <p>Made with love by @Rajat</p>
      </div>
    </div>
  );
}
