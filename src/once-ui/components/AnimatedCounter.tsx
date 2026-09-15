"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/once-ui/hooks/useInView";

interface AnimatedCounterProps {
  /** Target number to count up (or down) to, e.g. 18 or -35. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Animation length in milliseconds. */
  duration?: number;
}

/**
 * AnimatedCounter
 * ---------------
 * Counts from 0 up to `value` with an ease-out curve, starting the
 * moment it scrolls into view (via the shared useInView hook), rather
 * than animating on mount — so it still feels intentional even when
 * it's already above the fold on first paint.
 */
export function AnimatedCounter({ value, prefix = "", suffix = "", duration = 1200 }: AnimatedCounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let startTime: number | null = null;
    let rafId = 0;

    function step(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
