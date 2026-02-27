"use client";

import {
  ANIMATION_DURATION,
  CYCLE_DURATION,
  PLACEHOLDERS,
} from "@/constants/placeholdertext";
import { useEffect, useState } from "react";

export function AnimatedPlaceholder({ show }: { show: boolean }) {
  const [index, setIndex] = useState(0);
  const [animationState, setAnimationState] = useState<
    "idle" | "enter" | "exit"
  >("idle");

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setAnimationState("exit");

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setAnimationState("enter");
      }, ANIMATION_DURATION);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 flex items-center px-9 overflow-hidden">
        <span className="text-muted-foreground text-sm flex gap-1 whitespace-nowrap select-none">
          <span>Search for</span>
          <span
            className={`
            inline-block font-semibold
            ${animationState === "exit" ? "animate-slide-up" : ""}
            ${animationState === "enter" ? "animate-slide-in" : ""}
          `}
          >
            {PLACEHOLDERS[index]}
          </span>
        </span>
      </div>
    </>
  );
}
