"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ChevronRight, CreditCard, CreditCardIcon, Home, LocateFixed, MapPin, Package, Search, ShieldCheck, Smartphone, Truck, User } from "lucide-react";
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

  // const addressFields = [
  //   { key: "fullName", label: "Full Name", placeholder: "John Doe", icon: User, type: "text" },
  //   { key: "mobile", label: "Mobile Number", placeholder: "+91 98765 43210", icon: Smartphone, type: "tel" },
  //   { key: "state", label: "State", placeholder: "Maharashtra", icon: MapPin, type: "text" },
  //   { key: "city", label: "City", placeholder: "Mumbai", icon: MapPin, type: "text" },
  //   { key: "pincode", label: "Pincode", placeholder: "400001", icon: Home, type: "text" },
  //   { key: "fullAddress", label: "Full Address", placeholder: "Street, Area, Landmark...", icon: Home, type: "text" },
  // ];

  return (
    <>
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
    
    {/* <div className="min-h-screen bg-[#f8f7f4]">
      <div className="bg-zinc-900 text-white text-xs py-2 text-center tracking-widest font-medium uppercase">
        <ShieldCheck className="inline h-3 w-3 mr-1 mb-0.5" />
        Secure Checkout — SSL Encrypted
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-xs text-zinc-400 font-medium tracking-wide">
        <span className="text-zinc-800">Cart</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-amber-600 font-semibold">Checkout</span>
        <ChevronRight className="h-3 w-3" />
        <span>Confirmation</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-zinc-900 mb-1 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
          Complete Your Order
        </h1>
        <p className="text-sm text-zinc-500 mb-8">Fill in the details below to place your order</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-zinc-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-zinc-900">Delivery Address</CardTitle>
                    <CardDescription className="text-xs text-zinc-400">Where should we deliver your order?</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addressFields.map(({ key, label, placeholder, icon: Icon, type }) => (
                    <div key={key} className={cn("space-y-1.5", key === "fullAddress" && "sm:col-span-2")}>
                      <Label htmlFor={key} className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        {label}
                      </Label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                        <Input
                          id={key}
                          type={type}
                          placeholder={placeholder}
                          value={address[key]}
                          onChange={(e) => setAddress((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="pl-9 h-10 text-sm border-zinc-200 bg-zinc-50 rounded-lg focus:bg-white focus:border-amber-400 focus:ring-amber-100 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Search className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-zinc-900">Pin on Map</CardTitle>
                    <CardDescription className="text-xs text-zinc-400">Search or drag the pin for precise location</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 pb-5">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                    <Input
                      placeholder="Search address or landmark..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 text-sm border-zinc-200 bg-zinc-50 rounded-lg focus:bg-white focus:border-blue-400 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSearchQuery}
                    variant="outline"
                    className="h-10 px-4 text-sm border-zinc-200 hover:bg-zinc-50 rounded-lg font-medium"
                  >
                    Search
                  </Button>
                </div>

                <div className="h-[280px] relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                    Map Component Here
                  </div>
                  <button
                    type="button"
                    onClick={fetchCurrentLocation}
                    className="absolute bottom-3 right-3 z-10 bg-white text-blue-600 shadow-md rounded-lg p-2 hover:bg-blue-50 transition-colors border border-zinc-200"
                    title="Use my location"
                  >
                    <LocateFixed className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5 lg:sticky lg:top-6">

            <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle className="text-base font-semibold text-zinc-900">Order Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-5 space-y-3">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Delivery Fee
                  </span>
                  <span className="font-medium text-zinc-900">₹{deliveryFee}</span>
                </div>
                <Separator className="my-1 bg-zinc-100" />
                <div className="flex justify-between text-base font-bold text-zinc-900">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-0 font-medium">
                  🎉 You save ₹150 on this order!
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                  </div>
                  <CardTitle className="text-base font-semibold text-zinc-900">Payment Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-5 space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group",
                    paymentMethod === "cod"
                      ? "border-amber-400 bg-amber-50 shadow-sm"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    paymentMethod === "cod" ? "border-amber-500" : "border-zinc-300"
                  )}>
                    {paymentMethod === "cod" && <div className="h-2 w-2 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Cash on Delivery</div>
                    <div className="text-xs text-zinc-500">Pay when your order arrives</div>
                  </div>
                  <Truck className="ml-auto h-5 w-5 text-zinc-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group",
                    paymentMethod === "online"
                      ? "border-blue-400 bg-blue-50 shadow-sm"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white"
                  )}
                >
                  <div className={cn(
                    "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    paymentMethod === "online" ? "border-blue-500" : "border-zinc-300"
                  )}>
                    {paymentMethod === "online" && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Pay Online</div>
                    <div className="text-xs text-zinc-500">Stripe — Cards, UPI & more</div>
                  </div>
                  <CreditCard className="ml-auto h-5 w-5 text-zinc-400" />
                </button>
              </CardContent>
            </Card>

            <Button
              onClick={handlePayment}
              className={cn(
                "w-full h-13 text-base font-semibold rounded-xl tracking-wide transition-all shadow-md",
                paymentMethod === "cod"
                  ? "bg-zinc-900 hover:bg-zinc-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {paymentMethod === "cod" ? (
                <><Truck className="mr-2 h-4 w-4" /> Place Order — ₹{finalTotal.toLocaleString()}</>
              ) : (
                <><CreditCard className="mr-2 h-4 w-4" /> Pay ₹{finalTotal.toLocaleString()} & Place Order</>
              )}
            </Button>

            <p className="text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your payment info is encrypted & secure
            </p>
          </div>

        </div>
      </div>
    </div> */}
    </>
  );
}
