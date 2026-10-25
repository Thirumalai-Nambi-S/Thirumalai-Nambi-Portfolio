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

    const reveal = () => {
      setInView(true);
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };

    // Safety net for fast flings and very tall blocks (common on phones, where a
    // section can be several screens high): reveal anything that has reached the
    // viewport, or that the user has already scrolled past.
    const check = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) reveal();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      // threshold is a *fraction of the element*, so keep it tiny — a 0.2 threshold on
      // a section 6x taller than the screen could never be satisfied.
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px", ...options }
    );

    observer.observe(node);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.threshold, options?.rootMargin]);

  return { ref, inView } as const;
}
