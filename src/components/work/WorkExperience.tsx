import React from "react";
import Link from "next/link";
import { Column, Flex, Heading, ScrollReveal, SmartImage, Tag, Text } from "@/once-ui/components";
import { about, work } from "@/app/resources/content";
import styles from "./WorkExperience.module.scss";

const CARD_ACCENTS = ["#22D3EE", "#A78BFA", "#FB923C", "#34D399"];

export function WorkExperience() {
  const { experiences } = about.work;
  const { freelance } = work;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l" horizontal="center">
      <ScrollReveal direction="blur">
        <Column fillWidth gap="8" paddingTop="l" horizontal="center" align="center">
          <Heading as="h1" variant="display-strong-m" wrap="balance" align="center">
            {work.title}
          </Heading>
          <Text
            variant="heading-default-m"
            onBackground="neutral-weak"
            wrap="balance"
            align="center"
            style={{ maxWidth: "760px" }}
          >
            {work.description}
          </Text>
        </Column>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.05}>
        <Column fillWidth gap="8" horizontal="center" align="center">
          <Heading as="h2" variant="heading-strong-l" align="center">
            Freelance Work
          </Heading>
        </Column>
      </ScrollReveal>
      {freelance.length > 0 ? (
        <Column fillWidth gap="l">
          {freelance.map((item, index) => (
            <ScrollReveal key={`${item.title}-${index}`} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.08}>
            <Column
              fillWidth
              gap="12"
              padding="24"
              radius="l"
              className={styles.accentCard}
              style={{ ["--card-accent" as any]: CARD_ACCENTS[index % CARD_ACCENTS.length] }}
              background="surface"
            >
              <Flex fillWidth horizontal="space-between" vertical="start" wrap gap="8">
                <Column gap="4">
                  <Text variant="heading-strong-l">{item.title}</Text>
                  {item.client && (
                    <Text variant="body-default-s" onBackground="brand-weak">
                      {item.client}
                    </Text>
                  )}
                </Column>
                <Tag size="m" variant="accent" label="Freelance" />
              </Flex>
              {item.timeframe && (
                <Text variant="body-default-s" onBackground="neutral-weak">
                  {item.timeframe}
                </Text>
              )}
              {item.description && <Text variant="body-default-m">{item.description}</Text>}
            </Column>
            </ScrollReveal>
          ))}
        </Column>
      ) : (
        <Column
          fillWidth
          gap="8"
          padding="32"
          radius="l"
          background="neutral-alpha-weak"
          horizontal="center"
          align="center"
        >
          <Text variant="body-default-m" onBackground="neutral-weak" align="center">
            Currently open to freelance data analytics and AI projects — reach out if you'd like
            to collaborate.
          </Text>
        </Column>
      )}

      <ScrollReveal direction="up" delay={0.05}>
        <Column fillWidth gap="8" horizontal="center" align="center" paddingTop="24">
          <Heading as="h2" variant="heading-strong-l" align="center">
            Internships
          </Heading>
        </Column>
      </ScrollReveal>
      <Column fillWidth gap="l">
        {experiences.map((experience: any, index: number) => (
          <ScrollReveal key={`${experience.company}-${index}`} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.08}>
            <ExperienceCard experience={experience} accent={CARD_ACCENTS[index % CARD_ACCENTS.length]} />
          </ScrollReveal>
        ))}
      </Column>
    </Column>
  );
}

function ExperienceCard({ experience, accent }: { experience: any; accent: string }) {
  const demoSrc: string | undefined = experience.demoVideo;

  return (
    <Column
      fillWidth
      gap="16"
      padding="24"
      radius="l"
      className={styles.accentCard}
      style={{ ["--card-accent" as any]: accent }}
      background="surface"
    >
      <div className={styles.layout}>
        <Column gap="12" className={styles.details}>
          <Flex fillWidth horizontal="space-between" vertical="start" wrap gap="8">
            <Column gap="4">
              <Text variant="heading-strong-l">{experience.company}</Text>
              <Text variant="body-default-s" onBackground="brand-weak">
                {experience.role}
              </Text>
            </Column>
            <Tag size="m" variant="brand" label="Internship" />
          </Flex>
          <Text variant="body-default-s" onBackground="neutral-weak">
            {experience.timeframe}
          </Text>
          <Column as="ul" gap="12" marginTop="8">
            {experience.achievements.map((achievement: React.ReactNode, i: number) => (
              <Text as="li" variant="body-default-m" key={`${experience.company}-ach-${i}`}>
                {achievement}
              </Text>
            ))}
          </Column>
        </Column>

        {demoSrc && (
          <div className={styles.mediaColumn}>
            <div className={styles.media}>
              <SmartImage
                src={demoSrc}
                alt={`${experience.company} project demo`}
                fill
                sizes="(max-width: 760px) 100vw, 40vw"
              />
            </div>
            {experience.projectSlug && (
              <Link
                href={`/project?project=${experience.projectSlug}`}
                className={styles.expandButton}
              >
                ⤢ Expand
              </Link>
            )}
          </div>
        )}
      </div>
    </Column>
  );
}
