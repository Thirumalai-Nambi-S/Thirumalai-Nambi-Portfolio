"use client";

import { useEffect } from "react";

/**
 * Makes every glass surface catch the cursor's light.
 * Glass elements are tagged with `--lg: 1` (see styles/_glass.scss); while the
 * pointer moves we write its position into --px / --py on every glass element
 * under it, and the stylesheet paints a soft highlight there.
 */
export function PointerGlow() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cache = new WeakMap<Element, boolean>();
    const isGlass = (el: Element) => {
      let v = cache.get(el);
      if (v === undefined) {
        v = getComputedStyle(el).getPropertyValue("--lg").trim() === "1";
        cache.set(el, v);
      }
      return v;
    };

    let active: HTMLElement[] = [];
    let raf = 0;
    let last: PointerEvent | null = null;

    const clear = (els: HTMLElement[]) =>
      els.forEach((el) => {
        el.style.removeProperty("--px");
        el.style.removeProperty("--py");
      });

    const frame = () => {
      raf = 0;
      if (!last) return;
      const found: HTMLElement[] = [];
      let el = last.target as Element | null;
      for (let i = 0; el && i < 10; i += 1, el = el.parentElement) {
        if (isGlass(el)) found.push(el as HTMLElement);
      }
      clear(active.filter((a) => !found.includes(a)));
      found.forEach((f) => {
        const r = f.getBoundingClientRect();
        f.style.setProperty("--px", `${last!.clientX - r.left}px`);
        f.style.setProperty("--py", `${last!.clientY - r.top}px`);
      });
      active = found;
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      clear(active);
      active = [];
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      clear(active);
    };
  }, []);

  return null;
}
