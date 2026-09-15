"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./LoadingScreen.module.scss";

export const LoadingScreen: React.FC = () => {
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const percentRef = useRef<HTMLSpanElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Lock page scrolling during opening animation
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const startTime = performance.now();
    const duration = 3200; // 3.2s progress duration (extra 1 second of animation)

    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Direct DOM text updates — ZERO React re-renders for buttery 120fps smoothness!
      if (percentRef.current) {
        percentRef.current.textContent = `${progress}%`;
      }

      if (statusRef.current) {
        if (progress < 35) {
          statusRef.current.textContent = "INITIALIZING EXPERIENCE";
        } else if (progress < 70) {
          statusRef.current.textContent = "LOADING ASSETS & MODELS";
        } else if (progress < 95) {
          statusRef.current.textContent = "PREPARING WORKSPACE";
        } else {
          statusRef.current.textContent = "READY · WELCOME";
        }
      }

      if (progress < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Hold briefly at 100% then start cinematic exit
        const exitTimer = setTimeout(() => {
          setIsExiting(true);
        }, 300);

        // Remove from DOM and restore scrolling
        const finishTimer = setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = prevBodyOverflow;
          document.documentElement.style.overflow = prevHtmlOverflow;
        }, 800);

        return () => {
          clearTimeout(exitTimer);
          clearTimeout(finishTimer);
        };
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  if (isDone) return null;

  const firstName = "Thirumalai";
  const lastName = "Nambi";

  // Skip on click / tap if desired
  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsDone(true);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }, 400);
  };

  return (
    <div
      className={`${styles.loadingOverlay} ${isExiting ? styles.exiting : ""}`}
      onClick={handleSkip}
      title="Click to skip"
    >
      <div className={styles.glowBackdrop} />

      <div className={styles.contentContainer}>
        {/* Emblem Monogram */}
        <div className={styles.emblemWrapper}>
          <div className={styles.emblemRing} />
          <span className={styles.emblemText}>TN</span>
        </div>

        {/* 3D Zoom-in Name Animation: Letters fly in from outside the screen */}
        <h1 className={styles.nameHeading}>
          <span className={styles.word}>
            {firstName.split("").map((letter, index) => (
              <span
                key={`fn-${index}`}
                className={styles.letter}
                style={{
                  animationDelay: `${0.12 + index * 0.07}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
          <span className={styles.word}>
            {lastName.split("").map((letter, index) => (
              <span
                key={`ln-${index}`}
                className={styles.letter}
                style={{
                  animationDelay: `${0.12 + (firstName.length + index) * 0.07 + 0.08}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle Roles */}
        <div className={styles.subtitle}>
          <span>AI/ML Engineer</span>
          <span className={styles.subtitleDot} />
          <span>Data Scientist</span>
          <span className={styles.subtitleDot} />
          <span>Full-Stack Developer</span>
        </div>

        {/* Hardware-Accelerated Neon Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} />
          </div>

          <div className={styles.progressInfo}>
            <div className={styles.statusText}>
              <span className={styles.statusIndicator} />
              <span ref={statusRef}>INITIALIZING EXPERIENCE</span>
            </div>
            <span ref={percentRef} className={styles.percentage}>
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
