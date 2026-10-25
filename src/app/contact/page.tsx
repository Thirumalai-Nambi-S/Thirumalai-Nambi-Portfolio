import React from "react";
import { baseURL } from "@/app/resources";
import { person, contact } from "@/app/resources/content";
import { ContactStage } from "./ContactStage";
import styles from "./contact.module.scss";

export async function generateMetadata() {
  return {
    title: contact.title,
    description: contact.description,
    openGraph: {
      title: contact.title,
      description: contact.description,
      type: "website",
      url: `https://${baseURL}/contact`,
    },
  };
}

export default function Contact() {
  const words = contact.title.split(" ");

  return (
    <div className={styles.wrap}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: contact.title,
            description: contact.description,
            url: `https://${baseURL}/contact`,
          }),
        }}
      />

      <header className={styles.hero}>
        <p className={`${styles.badge} ${styles.enter}`}>
          <span aria-hidden="true">✦</span> Get in touch
        </p>

        <h1 className={styles.title} aria-label={contact.title}>
          {words.map((w, i) => (
            <React.Fragment key={`${w}-${i}`}>
              <span
                className={styles.word}
                aria-hidden="true"
                style={{ ["--w" as string]: `${0.1 + i * 0.09}s` } as React.CSSProperties}
              >
                {w}
              </span>
              {i < words.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </h1>

        <p className={`${styles.intro} ${styles.enter}`} style={{ ["--d" as string]: "0.3s" } as React.CSSProperties}>
          {contact.intro}
        </p>
      </header>

      <ContactStage
        name={person.name.trim()}
        role={person.role}
        avatar={person.avatar}
        availability={contact.availability}
        email={person.email}
        methods={contact.methods.map((m) => ({ label: m.label, value: m.value, href: m.href, icon: m.icon }))}
        socials={contact.socials.map((s) => ({ label: s.label, href: s.href, icon: s.icon }))}
      />
    </div>
  );
}
