"use client";

import { slides } from "@/constants/heroslides";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

export default function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, duration: 40 }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => {
            const Icon = slide.icon;
            return (
              <CarouselItem key={slide.id}>
                <div
                  className={`relative w-full min-h-[420px] md:min-h-[480px] bg-linear-to-br ${slide.bg} overflow-hidden flex items-center px-8 md:px-16`}
                >
                  <div
                    className={`absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-20 ${slide.decoration}`}
                  />
                  <div
                    className={`absolute -left-30 h-180 w-180 rounded-full opacity-20 ${slide.decoration}`}
                  />
                  <div
                    className={`absolute top-8 right-52 h-20 w-20 rounded-full opacity-20 ${slide.decoration}`}
                  />

                  <div className="relative z-10 max-w-xl flex flex-col gap-6">
                    <div
                      className={`w-fit rounded-2xl p-4 ${slide.iconBg} shadow-md backdrop-blur-sm`}
                    >
                      <Icon className="h-10 w-10" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                        {slide.title}
                      </h1>
                      <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-sm">
                        {slide.subtitle}
                      </p>
                    </div>

                    <Button
                      className={`w-fit rounded-full px-10 py-6 text-base font-bold shadow-lg tracking-wide cursor-pointer ${slide.btnStyle}`}
                    >
                      {slide.btnText} →
                    </Button>
                  </div>

                  <div className="absolute right-10 bottom-0 text-[160px] md:text-[220px] opacity-70 select-none pointer-events-none leading-none">
                    {slide.emoji}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition cursor-pointer"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button> */}
      </Carousel>

      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              current === i ? "w-6 bg-green-600" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
}
