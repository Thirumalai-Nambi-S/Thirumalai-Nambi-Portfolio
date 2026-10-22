"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MiniGamesSection } from "./MiniGamesSection";
import styles from "./minigames.module.scss";

/**
 * GamesLauncher
 * -------------
 * Floating "Games" button fixed at the bottom-left of the home page.
 * Clicking it opens the same Mini Games section (tabs + game panel) that
 * used to sit inline on the home page, inside an overlay.
 */
export function GamesLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  // Rendered through a portal on <body> so `position: fixed` is always measured
  // against the real viewport, never against a transformed page wrapper.
  if (!mounted) return null;

  return createPortal(
    <>
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
