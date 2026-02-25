"use client";

import { categories } from "@/constants/categories";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function CategorySlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };
    api.on("select", update);
    update();
  }, [api]);

  return (
    <div className="m-6 px-6 py-4 border border-gray-300 rounded-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2 capitalize">
        Popular categories
      </h2>
      <Carousel
        opts={{
          align: "start",
          // loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {categories.map((category, index) => (
            <CarouselItem
              key={index}
              className="pl-2 py-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8"
            >
              <div
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${category.color}`}
              >
                <div className="rounded-full p-3 bg-white shadow-sm text-2xl flex items-center justify-center w-12 h-12">
                  {category.emoji}
                </div>
                <span className="text-xs font-semibold text-center leading-tight">
                  {category.label}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && (
          <CarouselPrevious className="left-0 cursor-pointer text-green-700 hover:text-green-500" />
        )}
        {canScrollNext && (
          <CarouselNext className="right-0 cursor-pointer text-green-700 hover:text-green-500" />
        )}
      </Carousel>
    </div>
  );
}
