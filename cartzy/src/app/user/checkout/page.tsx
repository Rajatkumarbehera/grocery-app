"use client";

import { RootState } from "@/redux/store";
import axios from "axios";
// import { OpenStreetMapProvider } from "leaflet-geosearch";
import { CreditCardIcon, LocateFixed } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Map = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

export default function CheckoutPage() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });
  console.log(userData);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData?.name || "",
      }));
      setAddress((prev) => ({
        ...prev,
        mobile: userData?.mobile || "",
      }));
    }
  }, [userData]);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          console.log();

          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Error getting user location:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        },
      );
    } else {
      console.log("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        console.log(result.data);
        setAddress((prev) => ({
          ...prev,
          city: result?.data?.address?.city,
          state: result?.data?.address?.state,
          pincode: result?.data?.address?.postcode,
          fullAddress: result?.data?.display_name,
        }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchAddress();
  }, [position]);

  const handleSearchQuery = async () => {
    const { OpenStreetMapProvider } = await import("leaflet-geosearch");
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    if (results) {
      setPosition([results[0].y, results[0].x]);
    }
    console.log(results);
  };

  const handlePayment = () => {
    if (paymentMethod === "cod") {
      handleCod();
    } else {
      handleOnline();
    }
  };

  const handleCod = async () => {
    if (!position) return null;
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          mobile: address.mobile,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });

      router.push("/user/order-success");
      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnline = async () => {
    if (!position) return null;
    try {
      const result = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          mobile: address.mobile,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1],
        },
        paymentMethod,
      });
      console.log(result);

      window.location.href = result.data.url;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <p>CheckoutPage</p>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <input
            type="text"
            className="outline"
            placeholder="Name"
            value={address.fullName}
            // onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
          <input
            type="text"
            className="outline"
            placeholder="mobile"
            value={address.mobile}
            // onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, mobile: e.target.value }))
            }
          />
          <input
            type="text"
            className="outline"
            placeholder="state"
            value={address.state}
            // onChange={(e) => setAddress({ ...address, state: e.target.value })}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, state: e.target.value }))
            }
          />
          <input
            type="text"
            className="outline"
            placeholder="city"
            value={address.city}
            // onChange={(e) => setAddress({ ...address, city: e.target.value })}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, city: e.target.value }))
            }
          />
          <input
            type="text"
            className="outline"
            placeholder="pincode"
            value={address.pincode}
            // onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, pincode: e.target.value }))
            }
          />
          <input
            type="text"
            className="outline"
            placeholder="full address"
            value={address.fullAddress}
            // onChange={(e) =>
            //   setAddress({ ...address, fullAddress: e.target.value })
            // }
            onChange={(e) =>
              setAddress((prev) => ({ ...prev, fullAddress: e.target.value }))
            }
          />
          <input
            type="text"
            className="outline"
            placeholder="search address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" onClick={handleSearchQuery}>
            Search
          </button>
          <div className="h-[300px] relative overflow-hidden border mt-6">
            <Map position={position} setPosition={setPosition} />
            <LocateFixed
              className="h-6 w-6 absolute bottom-4 right-4 z-999 text-blue-500 shadow-md p-1 rounde-sm bg-white cursor-pointer"
              onClick={fetchCurrentLocation}
            />
          </div>
        </div>
        <div>
          <h2>Payment method</h2>
          <div>
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer ${
                paymentMethod === "cod"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span className="font-medium">Cash on Delivery</span>
            </div>

            {/* ONLINE PAYMENT OPTION */}
            <div
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer ${
                paymentMethod === "online"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              <span className="font-medium">Pay Online (Stripe)</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span>SubTotal: {subTotal}</span>
            <span>DeliveryFee: {deliveryFee}</span>
            <span>Final Total: {finalTotal}</span>
          </div>
          <button
            className="text-white rounded-md px-4 py-1 bg-green-600 cursor-pointer"
            onClick={handlePayment}
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
