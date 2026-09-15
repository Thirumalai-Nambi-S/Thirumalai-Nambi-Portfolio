"use client";

import React, { useState } from "react";
import Image from "next/image";

import styles from "./HeroPortrait.module.scss";

interface HeroPortraitProps {
  /** Default portrait, shown at rest. */
  defaultSrc: string;
  /** Alternate portrait, revealed on hover / tap. */
  hoverSrc: string;
  alt: string;
}

/**
 * Hero portrait that swaps from a default photo to an alternate
 * illustrated version on hover, with a smooth crossfade + tilt animation.
 * On touch devices (no hover), tapping toggles between the two images.
 */
export function HeroPortrait({ defaultSrc, hoverSrc, alt }: HeroPortraitProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`${styles.portraitSwap} ${active ? styles.isActive : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((prev) => !prev)}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${alt} portrait — hover or tap to reveal the illustrated version`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActive((prev) => !prev);
        }
      }}
    >
      <div className={`${styles.face} ${styles.faceDefault}`}>
        <Image
          src={defaultSrc}
          alt={alt}
          fill
          sizes="440px"
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={`${styles.face} ${styles.faceHover}`}>
        <Image
          src={hoverSrc}
          alt={`${alt} — illustrated`}
          fill
          sizes="440px"
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
