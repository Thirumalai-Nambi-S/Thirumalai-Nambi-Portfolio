"use client";

import { useEffect, useRef } from "react";
import styles from "./template.module.scss";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animation = "none";
    // Force reflow
    void el.offsetHeight;
    el.style.animation = "";
  }, []);

  return (
    <div ref={ref} className={styles.pageTransition}>
      {children}
    </div>
  );
}