"use client";

import { useEffect, useState } from "react";
import styles from "@/app/home.module.scss";

const PHRASES = [
  "I solve real-world problems with data & AI.",
  "I turn raw data into decisions.",
  "I build ML models that ship to production.",
  "I craft full-stack products with Next.js.",
];

/** Typewriter line under the hero buttons — types, pauses, deletes, loops. */
export function HeroTyping() {
  const [text, setText] = useState("");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
  }, []);

  useEffect(() => {
    if (reduce) {
      setText(PHRASES[0]);
      return;
    }
    let phrase = 0;
    let index = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const full = PHRASES[phrase];
      index += deleting ? -1 : 1;
      setText(full.slice(0, index));

      let delay = deleting ? 28 : 55;
      if (!deleting && index === full.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && index === 0) {
        deleting = false;
        phrase = (phrase + 1) % PHRASES.length;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <p className={styles.typing} aria-label={PHRASES[0]}>
      <span aria-hidden="true">{text}</span>
      <span className={styles.caret} aria-hidden="true" />
    </p>
  );
}
