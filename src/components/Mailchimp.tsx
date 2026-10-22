"use client";

import React from "react";
import { Heading, Icon } from "@/once-ui/components";
import styles from "./Mailchimp.module.scss";

type NewsletterProps = {
  display: boolean;
  title: string | React.JSX.Element;
  description: string | React.JSX.Element;
};

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScyB9qqiyI9vGWXqcUuMXqGVb7n2_XPIe0LX-qEv5g_1vsSHw/viewform?usp=sharing&ouid=115475524829771014354";

const TOPICS = [
  { icon: "chartBar", label: "Data Insights" },
  { icon: "brain", label: "AI Trends" },
  { icon: "book", label: "Analytics Tips" },
  { icon: "calendar", label: "Weekly Drops" },
];

export const Mailchimp = ({ newsletter }: { newsletter: NewsletterProps }) => {
  return (
    <section className={styles.card} aria-labelledby="newsletter-title">
      <span className={styles.borderGlow} aria-hidden="true" />

      {/* ── Left: story ── */}
      <div className={styles.copy}>
        <p className={styles.badge}>
          <span aria-hidden="true">✦</span> Newsletter
        </p>

        <Heading as="h2" id="newsletter-title" variant="display-strong-s" className={styles.title}>
          {newsletter.title}
        </Heading>

        <p className={styles.desc}>{newsletter.description}</p>

        <ul className={styles.topics}>
          {TOPICS.map((t) => (
            <li key={t.label} className={styles.topic}>
              <span className={styles.topicIcon}>
                <Icon name={t.icon} size="s" />
              </span>
              {t.label}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right: subscribe ticket ── */}
      <div className={styles.ticket}>
        <span className={styles.ticketIcon} aria-hidden="true">
          <Icon name="email" size="m" />
        </span>
        <p className={styles.ticketTitle}>Join the capsule</p>
        <p className={styles.ticketSub}>Free · No spam · Unsubscribe anytime</p>

        <a className={styles.cta} href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
          <span>Subscribe Now</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>

        <p className={styles.note}>Join data enthusiasts worldwide.</p>
      </div>
    </section>
  );
};
