"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Icon } from "@/once-ui/components";
import { useThemeCustomizer } from "@/contexts/ThemeCustomizerContext";
import { OPEN_GAMES_EVENT } from "@/components/minigames/GamesLauncher";
import styles from "./MobileMenu.module.scss";

/**
 * Hamburger button that lives inside the bottom nav bar on phones/tablets only.
 * It tucks the "extras" — Games and the Theme Studio (settings) — into a small
 * glass sheet, so nothing floats over the page content on small screens.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const { openCustomizer } = useThemeCustomizer();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const run = (action: () => void) => {
    setOpen(false);
    // let the sheet start closing before the next layer opens
    setTimeout(action, 120);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {mounted &&
        open &&
        createPortal(
          <>
            <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />
            <div className={styles.sheet} role="menu" aria-label="More">
              <button
                type="button"
                role="menuitem"
                className={styles.item}
                style={{ ["--i" as string]: 0 } as React.CSSProperties}
                onClick={() => run(() => window.dispatchEvent(new Event(OPEN_GAMES_EVENT)))}
              >
                <span className={styles.itemIcon} aria-hidden="true">
                  🎮
                </span>
                <span className={styles.itemText}>
                  <span className={styles.itemTitle}>Games</span>
                  <span className={styles.itemHint}>Take a quick break</span>
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                className={styles.item}
                style={{ ["--i" as string]: 1 } as React.CSSProperties}
                onClick={() => run(openCustomizer)}
              >
                <span className={styles.itemIcon} aria-hidden="true">
                  <Icon name="gear" size="s" />
                </span>
                <span className={styles.itemText}>
                  <span className={styles.itemTitle}>Theme Studio</span>
                  <span className={styles.itemHint}>Colour, spotlight &amp; glass</span>
                </span>
              </button>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
