"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/once-ui/components";
import styles from "./contact.module.scss";

type Method = { label: string; value: string; href?: string; icon: string };
type Social = { label: string; href: string; icon: string };

type Props = {
  name: string;
  role: string;
  avatar: string;
  availability: string;
  email: string;
  methods: Method[];
  socials: Social[];
};

/** Live clock for the visitor to see when I'm around (Asia/Kolkata). */
function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function ContactStage({ name, role, avatar, availability, email, methods, socials }: Props) {
  const time = useLocalTime();
  const [copied, setCopied] = useState<string | null>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      /* clipboard unavailable — the link itself still works */
    }
  };

  /* magnetic button: leans toward the cursor */
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

  const outer = socials.filter((_, i) => i % 2 === 0);
  const inner = socials.filter((_, i) => i % 2 === 1);

  const renderArm = (items: Social[], ring: "outer" | "inner") =>
    items.map((s, i) => (
      <div
        key={s.label}
        className={`${styles.arm} ${ring === "inner" ? styles.armInner : styles.armOuter}`}
        style={{ ["--i" as string]: i, ["--n" as string]: items.length } as React.CSSProperties}
      >
        <a
          className={styles.node}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          data-label={s.label}
        >
          <Icon name={s.icon} size="s" />
        </a>
      </div>
    ));

  return (
    <div className={styles.stageGrid}>
      {/* ───────── Orbit card ───────── */}
      <section className={`${styles.stage} ${styles.enter}`} style={{ ["--d" as string]: "0.35s" } as React.CSSProperties}>
        <div className={styles.orbit}>
          <span className={`${styles.ring} ${styles.ringOuter}`} aria-hidden="true" />
          <span className={`${styles.ring} ${styles.ringInner}`} aria-hidden="true" />
          {renderArm(outer, "outer")}
          {renderArm(inner, "inner")}

          <div className={styles.core}>
            <span className={styles.corePulse} aria-hidden="true" />
            <div className={styles.coreImg}>
              <Image src={avatar} alt={name} fill sizes="140px" priority className={styles.coreImgEl} />
            </div>
          </div>
        </div>

        <div className={styles.who}>
          <h2 className={styles.whoName}>{name}</h2>
          <p className={styles.whoRole}>{role}</p>
          <p className={styles.avail}>
            <span className={styles.pulse} aria-hidden="true" />
            {availability}
          </p>
          <div className={styles.chips}>
            <span className={styles.chip}>
              <Icon name="location" size="xs" /> Chennai{time ? ` · ${time} IST` : ""}
            </span>
            <span className={styles.chip}>Replies within a day</span>
          </div>
        </div>
      </section>

      {/* ───────── Reach me ───────── */}
      <section className={`${styles.reach} ${styles.enter}`} style={{ ["--d" as string]: "0.5s" } as React.CSSProperties}>
        <p className={styles.eyebrow}>Reach me directly</p>

        <ul className={styles.methods}>
          {methods.map((m, i) => {
            const canCopy = m.label === "Email" || m.label === "Phone";
            const isCopied = copied === m.label;
            return (
              <li
                key={m.label}
                className={styles.method}
                style={{ ["--d" as string]: `${0.65 + i * 0.1}s` } as React.CSSProperties}
              >
                <span className={styles.methodIcon}>
                  <Icon name={m.icon} size="s" />
                </span>
                <span className={styles.methodText}>
                  <span className={styles.methodLabel}>{m.label}</span>
                  {m.href ? (
                    <a className={styles.methodValue} href={m.href}>
                      {m.value}
                    </a>
                  ) : (
                    <span className={styles.methodValue}>{m.value}</span>
                  )}
                </span>
                {canCopy && (
                  <button
                    type="button"
                    className={`${styles.copyBtn} ${isCopied ? styles.copyBtnDone : ""}`}
                    onClick={() => copy(m.label, m.value)}
                    aria-label={`Copy ${m.label.toLowerCase()}`}
                  >
                    {isCopied ? "Copied ✓" : "Copy"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <a
          ref={ctaRef}
          className={styles.cta}
          href={`mailto:${email}`}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <span>Send me an email</span>
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </a>
      </section>
    </div>
  );
}
