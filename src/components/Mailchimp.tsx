"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Mailchimp.module.scss";

type NewsletterProps = {
  display: boolean;
  title: string | React.JSX.Element;
  description: string | React.JSX.Element;
};

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScyB9qqiyI9vGWXqcUuMXqGVb7n2_XPIe0LX-qEv5g_1vsSHw/viewform?usp=sharing&ouid=115475524829771014354";

/** Plain text of the title, so it can be revealed word by word. */
function titleText(title: NewsletterProps["title"]): string | null {
  if (typeof title === "string") return title;
  const children = (title as React.ReactElement<{ children?: unknown }>)?.props?.children;
  return typeof children === "string" ? children : null;
}

export const Mailchimp = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const cardRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [inView, setInView] = useState(false);

  /* play the entrance when the card scrolls into view */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* magnetic button */
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tx", `${((e.clientX - r.left) / r.width - 0.5) * 14}px`);
    el.style.setProperty("--ty", `${((e.clientY - r.top) / r.height - 0.5) * 10}px`);
  };
  const onLeave = () => {
    ctaRef.current?.style.setProperty("--tx", "0px");
    ctaRef.current?.style.setProperty("--ty", "0px");
  };

  const text = titleText(newsletter.title);
  const words = text ? text.split(" ") : [];

  return (
    <section
      ref={cardRef}
      className={`${styles.card} ${inView ? styles.in : ""}`}
      aria-labelledby="newsletter-title"
    >
      <span className={styles.borderGlow} aria-hidden="true" />

      {/* ── Left: one title, one line, one button ── */}
      <div className={styles.copy}>
        <p className={`${styles.badge} ${styles.reveal}`} style={{ ["--d" as string]: "0s" } as React.CSSProperties}>
          <span className={styles.badgeStar} aria-hidden="true">
            ✦
          </span>{" "}
          Newsletter
        </p>

        <h2 id="newsletter-title" className={styles.title} aria-label={text ?? undefined}>
          {text
            ? words.map((w, i) => (
                <React.Fragment key={`${w}-${i}`}>
                  <span
                    className={styles.word}
                    aria-hidden="true"
                    style={{ ["--w" as string]: `${0.1 + i * 0.08}s` } as React.CSSProperties}
                  >
                    {w}
                  </span>
                  {i < words.length - 1 ? " " : null}
                </React.Fragment>
              ))
            : newsletter.title}
        </h2>

        <p className={`${styles.desc} ${styles.reveal}`} style={{ ["--d" as string]: "0.45s" } as React.CSSProperties}>
          {newsletter.description}
        </p>

        <a
          ref={ctaRef}
          className={`${styles.cta} ${styles.reveal}`}
          style={{ ["--d" as string]: "0.6s" } as React.CSSProperties}
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <span>Subscribe Now</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>
      </div>

      {/* ── Right: an envelope that opens and lets a letter rise out of it ── */}
      <div className={styles.visual} aria-hidden="true">
        <span className={styles.halo} />
        <span className={styles.ringA} />
        <span className={styles.ringB} />
        <span className={`${styles.orbit} ${styles.orbit1}`} />
        <span className={`${styles.orbit} ${styles.orbit2}`} />
        <span className={`${styles.orbit} ${styles.orbit3}`} />

        <div className={styles.envelope}>
          <span className={styles.envBack} />
          <span className={styles.letter}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.envFront} />
          <span className={styles.flap} />
        </div>

        <span className={`${styles.star} ${styles.star1}`}>✦</span>
        <span className={`${styles.star} ${styles.star2}`}>✦</span>
        <span className={`${styles.star} ${styles.star3}`}>✦</span>
        <span className={`${styles.star} ${styles.star4}`}>✦</span>
        <span className={`${styles.star} ${styles.star5}`}>✦</span>
      </div>
    </section>
  );
};
