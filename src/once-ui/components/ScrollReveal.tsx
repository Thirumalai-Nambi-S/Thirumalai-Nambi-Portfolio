"use client";

import React from "react";
import classNames from "classnames";
import { useInView } from "@/once-ui/hooks/useInView";
import styles from "./ScrollReveal.module.scss";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which direction the content settles in from. Defaults to "up". */
  direction?: "up" | "down" | "left" | "right" | "scale" | "blur";
  /** Seconds to wait before this element starts its transition — use to
   *  stagger a list of siblings, e.g. delay={index * 0.08}. */
  delay?: number;
  /** IntersectionObserver threshold (0–1). Lower = triggers earlier. */
  threshold?: number;
  children: React.ReactNode;
}

/**
 * ScrollReveal
 * ------
 * Fades + slides (or scales / blurs) a block of content into place the
 * first time it scrolls into the viewport, then leaves it alone.
 *
 * Directions:
 *  - "up"    fade + slide up from below (default)
 *  - "down"  fade + slide down from above
 *  - "left"  fade + slide in from the left
 *  - "right" fade + slide in from the right
 *  - "scale" fade + scale up from slightly smaller
 *  - "blur"  fade + defocus → sharp (great for headings / hero text)
 */
export function ScrollReveal({
  direction = "up",
  delay = 0,
  threshold = 0.12,
  className,
  style,
  children,
  ...rest
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });

  return (
    <div
      ref={ref}
      className={classNames(
        styles.reveal,
        styles[direction],
        inView && styles.inView,
        className
      )}
      style={{ transitionDelay: `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
