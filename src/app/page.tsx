import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Column, AnimatedCounter, ScrollReveal } from "@/once-ui/components";
import { GamesLauncher } from "@/components/minigames/GamesLauncher";
import { HeroTyping } from "@/components/home/HeroTyping";

import { baseURL } from "@/app/resources";
import { home, person, newsletter } from "@/app/resources/content";
import { Mailchimp } from "@/components";
import styles from "./home.module.scss";

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}`,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Home() {
  return (
    <Column fillWidth horizontal="center" gap="xl" className={styles.page}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: home.title,
            description: home.description,
            url: `https://${baseURL}`,
            image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
            publisher: {
              "@type": "Person",
              name: person.name,
              image: {
                "@type": "ImageObject",
                url: `${baseURL}${person.avatar}`,
              },
            },
          }),
        }}
      />

      {/* ───────── HERO ───────── */}
      <section className={styles.hero} aria-labelledby="hero-name">
        <div className={styles.heroGrid}>
          <div className={styles.copy}>
            <p className={`${styles.hello} ${styles.rise}`} style={{ "--d": "0ms" } as React.CSSProperties}>
              Hello, I&apos;m
            </p>
            <h1
              id="hero-name"
              className={`${styles.name} ${styles.rise}`}
              style={{ "--d": "90ms" } as React.CSSProperties}
            >
              <span className={styles.nameGradient}>{person.name.trim()} S</span>
            </h1>
            <p className={`${styles.role} ${styles.rise}`} style={{ "--d": "180ms" } as React.CSSProperties}>
              AI/ML Engineer <i aria-hidden="true">·</i> Data Scientist <i aria-hidden="true">·</i> Full-Stack
              Developer
            </p>
            <p className={`${styles.bio} ${styles.rise}`} style={{ "--d": "270ms" } as React.CSSProperties}>
              Final-year B.Tech AI &amp; Data Science undergraduate who builds machine learning models, NLP and
              computer-vision pipelines, and full-stack products. Currently seeking full-time opportunities as an
              AI/ML Engineer, Data Scientist, or Full-Stack Developer.
            </p>

            <div className={`${styles.actions} ${styles.rise}`} style={{ "--d": "360ms" } as React.CSSProperties}>
              <a href={person.resume} download className={`${styles.btn} ${styles.btnPrimary}`}>
                Download Resume
              </a>
              <Link href="/project" className={`${styles.btn} ${styles.btnGhost}`}>
                View Projects
              </Link>
            </div>

            <div className={styles.rise} style={{ "--d": "450ms" } as React.CSSProperties}>
              <HeroTyping />
            </div>
          </div>

          <div className={`${styles.photoCol} ${styles.rise}`} style={{ "--d": "200ms" } as React.CSSProperties}>
            <div className={styles.photoWrap}>
              <span className={styles.photoGlow} aria-hidden="true" />
              <span className={styles.photoRing} aria-hidden="true" />
              <div className={styles.photo}>
                <Image
                  src={person.heroAvatar}
                  alt={person.name.trim()}
                  width={1019}
                  height={1510}
                  priority
                  sizes="(max-width: 860px) 320px, 480px"
                  className={styles.photoImg}
                />
              </div>
            </div>
          </div>
        </div>

        <ul className={`${styles.stats} ${styles.rise}`} style={{ "--d": "560ms" } as React.CSSProperties}>
          <li>
            <strong>
              <AnimatedCounter value={18} prefix="+" suffix="%" />
            </strong>
            <span>marketing ROI driven by data</span>
          </li>
          <li>
            <strong>
              <AnimatedCounter value={25} prefix="+" suffix="%" />
            </strong>
            <span>faster decision-making</span>
          </li>
          <li>
            <strong>
              <AnimatedCounter value={-35} suffix="%" />
            </strong>
            <span>task time via AI tooling</span>
          </li>
        </ul>
      </section>

      <GamesLauncher />

      {newsletter.display && (
        <ScrollReveal direction="scale" delay={0.05} threshold={0.05}>
          <Mailchimp newsletter={newsletter} />
        </ScrollReveal>
      )}
    </Column>
  );
}
