import React from "react";
import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Icon,
  IconButton,
  SmartImage,
  Tag,
  Text,
} from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import TableOfContents from "@/components/about/TableOfContents";
import { Panel } from "@/components/Panel";
import styles from "@/components/about/about.module.scss";
import { person, about, social } from "@/app/resources/content";
import { SkillGrid } from "@/components/about/SkillGrid";
import { ScrollReveal } from "@/once-ui/components/ScrollReveal";

export async function generateMetadata() {
  const title = about.title;
  const description = about.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/about`,
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

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];
  return (
    <Column maxWidth="l" horizontal="center" fillWidth style={{ margin: "0 auto" }}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: person.name,
            jobTitle: person.role,
            description: about.intro.description,
            url: `https://${baseURL}/about`,
            image: `${baseURL}/images/${person.avatar}`,
            sameAs: social
              .filter((item) => item.link && !item.link.startsWith("mailto:")) // Filter out empty links and email links
              .map((item) => item.link),
            worksFor: {
              "@type": "Organization",
              name: about.work.experiences[0].company || "",
            },
          }),
        }}
      />
      {about.tableOfContent.display && <TableOfContents structure={structure} about={about} />}
      <Flex fillWidth mobileDirection="column" horizontal="center" gap="40">
        {about.avatar.display && (
          <ScrollReveal
            direction="left"
            style={{ height: "fit-content", width: "auto", flexShrink: 0 }}
          >
          <Panel accent="cyan" noPadding>
          <Column
            className={styles.avatar}
            minWidth={18}
            maxWidth={22}
            paddingX="l"
            paddingY="l"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" priority className={styles.squareAvatar} />
            <Flex gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {person.location}
            </Flex>
            {person.languages.length > 0 && (
              <Flex wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Flex>
            )}
          </Column>
          </Panel>
          </ScrollReveal>
        )}
        <Column className={styles.blockAlign} flex={9} fillWidth>
          <ScrollReveal direction="right">
          <Panel id={about.intro.title} accent="cyan" className={styles.sectionPanel} noPadding>
          <Column
            fillWidth
            minHeight="160"
            vertical="center"
            padding="l"
          >
            {about.calendar.display && (
              <Flex
                fitWidth
                border="brand-alpha-medium"
                className={styles.blockAlign}
                style={{
                  backdropFilter: "blur(var(--static-space-1))",
                }}
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
              >
                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                <Flex paddingX="8">Schedule a call</Flex>
                <IconButton
                  href={about.calendar.link}
                  data-border="rounded"
                  variant="secondary"
                  icon="chevronRight"
                />
              </Flex>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Flex className={styles.blockAlign} paddingTop="20" paddingBottom="8" gap="8" wrap horizontal="center" fitWidth>
                {social.map(
                  (item) =>
                    item.link && (
                        <React.Fragment key={item.name}>
                            <Button
                                className="s-flex-hide"
                                href={item.link}
                                prefixIcon={item.icon}
                                label={item.name}
                                size="s"
                                variant="secondary"
                            />
                            <IconButton
                                className="s-flex-show"
                                size="l"
                                href={item.link}
                                icon={item.icon}
                                variant="secondary"
                            />
                        </React.Fragment>
                    ),
                )}
              </Flex>
            )}
          </Column>
          </Panel>
          </ScrollReveal>

          {about.intro.display && (
            <ScrollReveal direction="up" delay={0.05}>
            <Panel accent="cyan" className={styles.sectionPanel}>
            <Column textVariant="body-default-l" fillWidth gap="m">
              <Text variant="body-default-l" onBackground="neutral-weak">
                {about.introHighlight}
              </Text>
              <Text as="p" variant="body-default-l" style={{ lineHeight: 1.7 }}>
                {about.intro.description}
              </Text>
            </Column>
            </Panel>
            </ScrollReveal>
          )}

          {about.work.display && (
            <ScrollReveal direction="up" delay={0.1}>
            <Panel id={about.work.title} accent="violet" className={styles.sectionPanel}>
              <Heading as="h2" variant="display-strong-s" marginBottom="m">
                {about.work.title}
              </Heading>
              <Column fillWidth gap="l">
                {about.work.experiences.map((experience, index) => (
                  <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth>
                    <Flex fillWidth horizontal="space-between" vertical="end" marginBottom="4">
                      <Text id={experience.company} variant="heading-strong-l">
                        {experience.company}
                      </Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {experience.timeframe}
                      </Text>
                    </Flex>
                    <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                      {experience.role}
                    </Text>
                    <Column as="ul" gap="16">
                      {experience.achievements.map((achievement: React.ReactNode, index: number) => (
                        <Text
                          as="li"
                          variant="body-default-m"
                          key={`${experience.company}-${index}`}
                        >
                          {achievement}
                        </Text>
                      ))}
                    </Column>
                    {experience.images.length > 0 && (
                      <Flex fillWidth paddingTop="m" paddingLeft="40" wrap>
                        {experience.images.map((image, index) => (
                          <Flex
                            key={index}
                            border="neutral-medium"
                            radius="m"
                            //@ts-ignore
                            minWidth={image.width}
                            //@ts-ignore
                            height={image.height}
                          >
                            <SmartImage
                              enlarge
                              radius="m"
                              //@ts-ignore
                              sizes={image.width.toString()}
                              //@ts-ignore
                              alt={image.alt}
                              //@ts-ignore
                              src={image.src}
                            />
                          </Flex>
                        ))}
                      </Flex>
                    )}
                  </Column>
                ))}
              </Column>
            </Panel>
            </ScrollReveal>
          )}

          {about.studies.display && (
            <ScrollReveal direction="up" delay={0.15}>
            <Panel id={about.studies.title} accent="orange" className={styles.sectionPanel}>
              <Heading as="h2" variant="display-strong-s" marginBottom="m">
                {about.studies.title}
              </Heading>
              <Column fillWidth gap="l">
                {about.studies.institutions.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </Panel>
            </ScrollReveal>
          )}

          {about.technical.display && (
            <ScrollReveal direction="up" delay={0.2}>
            <Panel id={about.technical.title} accent="emerald" className={styles.sectionPanel}>
              <Heading
                as="h2"
                variant="display-strong-s"
                marginBottom="40"
              >
                {about.technical.title}
              </Heading>
              <div className={styles.techSkillGrid}>
                {about.technical.skills.map((skill: { title: string; icon?: string; description: React.ReactNode }, index: number) => {
                  const palette = ["#22D3EE", "#A78BFA", "#FB923C", "#34D399"];
                  const tint = palette[index % palette.length];
                  return (
                    <div
                      key={`${skill.title}-${index}`}
                      className={styles.techSkillCard}
                      style={{ ["--card-tint" as any]: tint }}
                    >
                      <div className={styles.techSkillIcon} style={{ color: tint }}>
                        <Icon name={skill.icon || "grid"} size="m" />
                      </div>
                      <Text as="h3" variant="heading-strong-m" marginTop="4" marginBottom="4">
                        {skill.title}
                      </Text>
                      <Text as="p" variant="body-default-s" onBackground="neutral-weak" wrap="balance">
                        {skill.description}
                      </Text>
                    </div>
                  );
                })}
              </div>

              {about.technical.categories && about.technical.categories.length > 0 && (
                <Column fillWidth gap="20" marginTop="32">
                  {about.technical.categories.map((category: { title: string; items: string[] }, index: number) => (
                    <Column key={`${category.title}-${index}`} fillWidth gap="8">
                      <Text
                        variant="label-default-s"
                        onBackground="neutral-weak"
                        style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
                      >
                        {category.title}
                      </Text>
                      <SkillGrid items={category.items} />
                    </Column>
                  ))}
                </Column>
              )}
            </Panel>
            </ScrollReveal>
          )}

          {about.repoSkills?.display && (
            <ScrollReveal direction="up" delay={0.25}>
            <Panel accent="cyan" className={styles.sectionPanel}>
              <Heading
                as="h2"
                id={about.repoSkills.title}
                variant="display-strong-s"
                marginBottom="12"
              >
                {about.repoSkills.title}
              </Heading>
              <Text
                variant="body-default-m"
                onBackground="neutral-weak"
                marginBottom="24"
                style={{ maxWidth: "640px" }}
              >
                {about.repoSkills.description}
              </Text>
              <div className={styles.repoSkillGrid}>
                {about.repoSkills.repos.map((repo: { name: string; url?: string; skills: string[] }) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.repoSkillCard}
                  >
                    <Flex gap="8" vertical="center" marginBottom="8" horizontal="space-between">
                      <Flex gap="8" vertical="center">
                        <Icon name="github" size="s" onBackground="neutral-weak" />
                        <Text variant="heading-strong-s">{repo.name}</Text>
                      </Flex>
                      <Icon name="arrowUpRightFromSquare" size="xs" onBackground="neutral-weak" />
                    </Flex>
                    <Flex wrap gap="8">
                      {repo.skills.map((skill: string) => (
                        <Tag key={skill} size="s" variant="brand" label={skill} />
                      ))}
                    </Flex>
                  </a>
                ))}
              </div>
            </Panel>
            </ScrollReveal>
          )}
        </Column>
      </Flex>
    </Column>
  );
}