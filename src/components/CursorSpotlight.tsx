"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorSpotlight.module.scss";

/**
 * CursorSpotlight
 * ----------------
 * A big, soft cyan glow that trails the cursor, sitting *behind* all
 * page content (cards, text, images) — it only reads clearly through
 * the negative space around them (margins, gaps between sections, the
 * open areas of the hero), rather than washing over the content itself.
 *
 * Only the large outer halo is active (the brighter inner core is
 * disabled in CursorSpotlight.module.scss — its rules are commented
 * out there; re-enable them and reintroduce a second ref here if you
 * want that sharper center back).
 *
 * Implementation notes:
 *  - A plain div updated via `transform: translate3d(...)` every
 *    animation frame — no React re-renders on pointer move.
 *  - Eased ("lerped") toward the target position each frame, which is
 *    what produces the trailing motion.
 *  - Visibility is driven by real "did the pointer leave the window"
 *    detection (mouseout with a null relatedTarget, plus pointerleave
 *    as a backup) rather than a plain `mouseleave` on `document` —
 *    that naive approach flickers off any time the cursor crosses an
 *    embedded YouTube <iframe>, since the iframe has its own document
 *    and can spuriously trigger a document-level mouseleave.
 *  - Opacity is re-affirmed on every pointer move (not just the first),
 *    so a moment of the glow being hidden never gets "stuck" hidden.
 */
export default function CursorSpotlight() {
  const outerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!hasFinePointer || reduceMotion) {
      // Static, centered ambient glow — no listeners, no rAF loop.
      const x = window.innerWidth / 2;
      const y = window.innerHeight * 0.35;
      outer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      outer.style.opacity = "1";
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let outerX = targetX;
    let outerY = targetY;
    let hasMoved = false;
    let rafId = 0;
    let running = true;

    function show() {
      outer!.style.opacity = "1";
    }

    function hide() {
      outer!.style.opacity = "0";
    }

    function handlePointerMove(e: PointerEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        // Snap on the very first movement so the glow doesn't slide in
        // from the center of the screen.
        outerX = targetX;
        outerY = targetY;
        hasMoved = true;
      }
      // Re-affirm visibility on every move, not just the first one —
      // otherwise a single false "leave" (e.g. crossing an iframe)
      // leaves the glow hidden forever.
      show();
    }

    // Real "left the browser viewport" detection. A plain `mouseleave`
    // on `document` can misfire when the pointer crosses an <iframe>
    // (YouTube embeds included), because the iframe briefly owns its
    // own document. Checking for a null relatedTarget/toElement on a
    // window-level `mouseout` is the standard, reliable way to detect
    // an actual exit.
    function handleWindowMouseOut(e: MouseEvent) {
      const leavingWindow = !e.relatedTarget && !(e as any).toElement;
      if (leavingWindow) hide();
    }

    function handlePointerLeaveWindow() {
      hide();
    }

    function tick() {
      if (!running) return;

      // Eases toward the pointer rather than snapping — that easing is
      // what produces the visible trailing motion.
      outerX += (targetX - outerX) * 0.06;
      outerY += (targetY - outerY) * 0.06;

      outer!.style.transform = `translate3d(${outerX}px, ${outerY}px, 0)`;

      rafId = requestAnimationFrame(tick);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("pointerleave", handlePointerLeaveWindow);
    document.addEventListener("visibilitychange", handleVisibility);
    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("pointerleave", handlePointerLeaveWindow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div ref={outerRef} className={styles.glowOuter} />
    </div>
  );
}
