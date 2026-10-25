"use client";

import { useEffect, useState } from "react";
import styles from "@/app/home.module.scss";

/**
 * Types the name out letter by letter (word by word) after the opening
 * animation. The full text is rendered invisibly to reserve its exact space,
 * so nothing shifts while typing. Honors prefers-reduced-motion.
 */
export function HeroName({ text, startDelay = 1500 }: { text: string; startDelay?: number }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [caretGone, setCaretGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      setDone(true);
      setCaretGone(true);
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      i += 1;
      setCount(i);
      if (i < text.length) {
        // a slightly longer beat at the space between words
        const pause = text[i - 1] === " " ? 220 : 80 + Math.random() * 50;
        timer = setTimeout(step, pause);
      } else {
        setDone(true);
        timer = setTimeout(() => setCaretGone(true), 1600);
      }
    };
    timer = setTimeout(step, startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay]);

  return (
    <span className={styles.nameWrap}>
      <span className={styles.nameSizer} aria-hidden="true">
        {text}
      </span>
      <span className={`${styles.nameTyped} ${styles.nameGradient}`} aria-hidden="true">
        {text.slice(0, count)}
        {!caretGone && <span className={`${styles.nameCaret} ${done ? styles.nameCaretDone : ""}`} />}
      </span>
    </span>
  );
}
