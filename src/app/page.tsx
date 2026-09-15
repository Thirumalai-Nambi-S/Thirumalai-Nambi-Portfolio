import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Heading, Flex, Text, Avatar, RevealFx, Column, AnimatedCounter, ScrollReveal } from "@/once-ui/components";
import { Panel } from "@/components/Panel";
import { MiniGamesSection } from "@/components/minigames/MiniGamesSection";

import { baseURL } from "@/app/resources";
import { home, about, person, newsletter } from "@/app/resources/content";
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
    <Column
      maxWidth="xl"
      gap="xl"
      horizontal="center"
      fillWidth
      style={{ margin: "0 auto" }}
    >
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
      <Panel accent="cyan" noPadding>
        <Column fillWidth paddingY="l" gap="m" className={styles.hero}>
        <Flex fillWidth className={styles.heroRow} gap="40">
          <Column maxWidth="s" className={styles.heroCopy}>
            <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="s">
              <Heading wrap="balance" variant="display-strong-m" align="left">
                {home.headline}
              </Heading>
            </RevealFx>
            <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="s">
              <Text wrap="balance" onBackground="neutral-weak" variant="body-default-l" align="left">
                {home.subline}
              </Text>
            </RevealFx>
            <RevealFx translateY="12" delay={0.4} horizontal="start">
              <div className={styles.ctaGrid}>
                <Link href="/about" className={`${styles.ctaButton} ${styles.ctaSecondary}`}>
                  {about.avatar.display && (
                    <Avatar src={person.avatar} size="m" priority className={styles.ctaAvatar} />
                  )}
                  <span>{about.title}</span>
                  <span className={styles.ctaArrow}>↗</span>
                </Link>

                <Link href="/project" className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
                  <span>View projects</span>
                  <span className={styles.ctaArrow}>▶</span>
                </Link>

                <a
                  href={person.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.ctaButton} ${styles.ctaSecondary}`}
                >
                  <span>Resume</span>
                  <span className={styles.ctaArrow}>↗</span>
                </a>

                <Link href="/gallery" className={`${styles.ctaButton} ${styles.ctaTertiary}`}>
                  <span>Achievements</span>
                  <span className={styles.ctaArrow}>→</span>
                </Link>
              </div>
            </RevealFx>
            <RevealFx translateY="16" delay={0.55} fillWidth>
              <Flex className={styles.stats} gap="12" wrap horizontal="start">
                <div>
                  <strong>
                    <AnimatedCounter value={18} prefix="+" suffix="%" />
                  </strong>
                  <span>marketing ROI driven by data</span>
                </div>
                <div>
                  <strong>
                    <AnimatedCounter value={25} prefix="+" suffix="%" />
                  </strong>
                  <span>faster decision-making</span>
                </div>
                <div>
                  <strong>
                    <AnimatedCounter value={-35} suffix="%" />
                  </strong>
                  <span>task time via AI tooling</span>
                </div>
              </Flex>
            </RevealFx>
          </Column>
          <RevealFx
            fillWidth={false}
            translateY="12"
            delay={0.3}
            className={styles.heroPortrait}
          >
            <div className={styles.portraitShape}>
              <Image
                src={person.heroAvatar}
                alt={person.name}
                fill
                sizes="440px"
                priority
                style={{ objectFit: "contain", objectPosition: "center bottom" }}
              />
              <span className={styles.portraitCorner} data-corner="tl" />
              <span className={styles.portraitCorner} data-corner="br" />
            </div>
          </RevealFx>
        </Flex>
        </Column>
      </Panel>
      <ScrollReveal direction="up" threshold={0.05}>
        <MiniGamesSection />
      </ScrollReveal>
      {newsletter.display && (
        <ScrollReveal direction="scale" delay={0.05} threshold={0.05}>
          <Panel accent="orange" noPadding>
            <Mailchimp newsletter={newsletter} />
          </Panel>
        </ScrollReveal>
      )}
    </Column>
  );
}
