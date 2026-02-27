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
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        className="w-full cursor-pointer"
      >
        <CarouselContent>
          {slides.map((slide) => {
            const Icon = slide.icon;
            return (
              <CarouselItem key={slide.id}>
                <div
                  className={`relative w-full min-h-[420px] md:min-h-[500px] bg-linear-to-br ${slide.bg} overflow-hidden flex items-center px-8 md:px-20`}
                >
                  <div
                    className={`absolute -top-24 -right-24 h-80 w-80 rounded-full blur-2xl ${slide.decoration}`}
                  />
                  <div
                    className={`absolute -bottom-20 -left-20 h-72 w-72 rounded-full blur-2xl ${slide.decoration}`}
                  />
                  <div
                    className={`absolute top-10 right-64 h-24 w-24 rounded-full blur-2xl ${slide.decoration}`}
                  />

                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
                      backgroundSize: "28px 28px",
                    }}
                  />

                  <div className="relative z-10 max-w-lg flex flex-col gap-6">
                    <div className="flex items-center gap-2 w-fit">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${slide.tagStyle}`}
                      >
                        {slide.tag ?? "Limited Offer"}
                      </span>
                    </div>

                    <div
                      className={`w-fit rounded-2xl p-4 ${slide.iconBg} shadow-lg backdrop-blur-sm`}
                    >
                      <Icon className="h-10 w-10" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tighter">
                        {slide.title}
                      </h1>
                      <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-sm">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        className={`w-fit rounded-full px-8 py-6 text-base font-bold shadow-lg tracking-wide transition-transform hover:scale-105 active:scale-95 ${slide.btnStyle}`}
                      >
                        {slide.btnText} →
                      </Button>
                      <span className="text-sm text-gray-400 font-medium">
                        {slide.offerNote ?? "Free delivery on first order"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      {[
                        { icon: "⚡", label: "30-min delivery" },
                        { icon: "🌿", label: "100% fresh" },
                        { icon: "🔒", label: "Secure checkout" },
                      ].map((badge) => (
                        <div
                          key={badge.label}
                          className="flex items-center gap-1.5"
                        >
                          <span className="text-sm">{badge.icon}</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {badge.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute right-10 bottom-0 text-[160px] md:text-[220px] opacity-75 select-none pointer-events-none leading-none drop-shadow-2xl transition-transform duration-500">
                    {slide.emoji}
                  </div>

                  <div className="absolute top-5 right-6 z-20 text-xs font-bold text-gray-400 tracking-widest">
                    {String(current + 1).padStart(2, "0")} /{" "}
                    {String(slides.length).padStart(2, "0")}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer border border-white/60"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer border border-white/60"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button> */}
      </Carousel>

      {/* <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                current === i
                  ? "w-7 h-2.5 bg-green-600 shadow-sm shadow-green-300"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div> */}
    </div>
  );
}
