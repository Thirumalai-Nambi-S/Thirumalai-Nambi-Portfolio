"use client";

import { useEffect, useState } from "react";
import styles from "./about.module.scss";

export interface SectionNavItem {
  id: string;
  label: string;
  accent: string;
}

/**
 * "On this page" navigation. Sits in the sticky left sidebar on desktop and
 * turns into a scrollable row of pills on tablets / phones. The active
 * section is tracked with an IntersectionObserver.
 */
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        });
        if (visible.size) {
          // the section closest to the top of the viewport wins
          const [id] = [...visible.entries()].sort((a, b) => a[1] - b[1])[0];
          setActive(id);
        }
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <nav className={styles.navCard} aria-label="On this page">
      <p className={styles.navTitle}>On this page</p>
      <ol className={styles.navList}>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => go(e, item.id)}
              className={`${styles.navLink} ${active === item.id ? styles.navLinkActive : ""}`}
              style={{ ["--accent" as string]: item.accent } as React.CSSProperties}
              aria-current={active === item.id ? "true" : undefined}
            >
              <span className={styles.navNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
