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
    <div className="m-6 rounded-2xl bg-linear-to-br from-green-50 via-white to-emerald-50 border border-green-100 shadow-sm px-6 py-5">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">
          Popular Categories
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Browse by what you need today
        </p>
      </div>
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
                className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${category.color}`}
              >
                <div className="relative rounded-2xl p-3 bg-white shadow-sm text-2xl flex items-center justify-center w-14 h-14 group-hover:scale-110 transition-transform duration-200">
                  {category.emoji}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/60 to-transparent pointer-events-none" />
                </div>

                <span className="text-xs font-bold text-center leading-tight text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category.label}
                </span>

                {/* item count — add a count field to your categories array */}
                {/* {category.count && ( */}
                <span className="text-[10px] text-gray-400 font-medium">
                  20+ items
                  {/* {category.count}+ items */}
                </span>
                {/* )} */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {canScrollPrev && (
          <CarouselPrevious className="left-0 cursor-pointer bg-white border border-gray-200 text-green-600 hover:bg-green-50 hover:text-green-700 shadow-md transition-all" />
        )}
        {canScrollNext && (
          <CarouselNext className="right-0 cursor-pointer bg-white border border-gray-200 text-green-600 hover:bg-green-50 hover:text-green-700 shadow-md transition-all" />
        )}
      </Carousel>
    </div>
  );
}
