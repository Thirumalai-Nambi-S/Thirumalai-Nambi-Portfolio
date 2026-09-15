"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useInView
 * ---------
 * Returns a ref to attach to an element and a boolean that flips to
 * `true` once the element scrolls into the viewport. Used to trigger
 * one-off reveal animations (fade/slide in) as the project rows come
 * into view, rather than animating everything on page load.
 *
 * The observer disconnects after the first reveal — these are one-time
 * entrance animations, not something that should replay every time the
 * user scrolls back up and down past a row.
 */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the browser can't do IntersectionObserver for some reason,
    // just show the content immediately rather than hiding it forever.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView } as const;
}
