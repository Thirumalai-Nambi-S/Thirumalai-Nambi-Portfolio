"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import styles from "./minigames.module.scss";

// The games are only downloaded the first time the popup is opened.
const MiniGamesSection = dynamic(() => import("./MiniGamesSection").then((m) => m.MiniGamesSection), {
  ssr: false,
});

/** Fire this from anywhere (e.g. the mobile menu) to open the Games popup. */
export const OPEN_GAMES_EVENT = "open-games";

/**
 * GamesLauncher
 * -------------
 * Mounted once in the root layout so the Games popup can be opened from any page.
 *  - Desktop: a floating "Games" pill in the bottom-left corner of the home page.
 *  - Mobile: the pill is hidden — Games lives in the hamburger menu of the nav bar,
 *    which dispatches OPEN_GAMES_EVENT.
 */
export function GamesLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_GAMES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_GAMES_EVENT, onOpen);
  }, []);

  // close when navigating
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Portal on <body> so `position: fixed` is measured against the real viewport.
  if (!mounted) return null;

  return createPortal(
    <>
      {pathname === "/" && (
        <button
          type="button"
          className={styles.launcher}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span aria-hidden="true">🎮</span>
          <span>Games</span>
        </button>
      )}

      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Mini games"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className={styles.overlayInner}>
            <button
              type="button"
              className={styles.overlayClose}
              onClick={() => setOpen(false)}
              aria-label="Close games"
            >
              ✕
            </button>
            <MiniGamesSection />
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
