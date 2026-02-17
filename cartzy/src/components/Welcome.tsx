import { ShoppingBasket } from "lucide-react";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4">
      <div className="flex items-center gap-3 animate-fade-in-down">
        <ShoppingBasket className="h-10 w-10 text-orange-600" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">
          Cartzy
        </h1>
      </div>
      <p className="text-gray-700 text-lg md:text-xl max-w-lg animate-fade-in-up">
        Shop smarter with Cartzy — discover quality products, enjoy seamless
        checkout, and get fast delivery right to your doorstep.
      </p>
    </div>
  );
}
