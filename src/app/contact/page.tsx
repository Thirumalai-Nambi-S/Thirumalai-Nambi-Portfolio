import { Avatar, Button, Column, Flex, Heading, Icon, ScrollReveal, Tag, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { person, contact, social } from "@/app/resources/content";
import { Panel } from "@/components/Panel";
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
  return (
    <Column maxWidth="m" gap="xl" horizontal="center" paddingY="l" fillWidth style={{ margin: "0 auto" }}>
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

      <ScrollReveal direction="up">
      <Panel accent="cyan">
        <Column fillWidth gap="16" horizontal="center" align="center">
          <Tag size="m" variant="brand" label="Get in touch" />
          <Heading as="h1" variant="display-strong-l" wrap="balance" align="center">
            {contact.title}
          </Heading>
          <Text
            variant="body-default-l"
            onBackground="neutral-weak"
            align="center"
            style={{ maxWidth: "620px" }}
          >
            {contact.intro}
          </Text>
        </Column>
      </Panel>
      </ScrollReveal>

      <ScrollReveal direction="left" delay={0.1}>
      <Panel accent="violet" noPadding>
        <div className={styles.grid}>
        <Column className={styles.card} gap="20">
          <Flex gap="16" vertical="center">
            <Avatar src={person.avatar} size="l" priority />
            <Column gap="4">
              <Text variant="heading-strong-l">{person.name}</Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {person.role}
              </Text>
            </Column>
          </Flex>

          <Text variant="body-default-s" onBackground="neutral-weak">
            {contact.availability}
          </Text>

          <Flex gap="8" wrap>
            {social
              .filter((item) => item.link)
              .map((item) => (
                <Button
                  key={item.name}
                  href={item.link}
                  variant="secondary"
                  size="s"
                  prefixIcon={item.icon}
                  data-border="rounded"
                >
                  {item.name}
                </Button>
              ))}
          </Flex>
        </Column>

        <Column className={styles.card} gap="16">
          <Text variant="label-default-s" onBackground="neutral-weak" className={styles.eyebrow}>
            Reach me directly
          </Text>
          <Column gap="4">
            {contact.methods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className={styles.methodRow}
                {...(!method.href && { style: { pointerEvents: "none", cursor: "default" } })}
              >
                <span className={styles.methodIcon}>
                  <Icon name={method.icon} size="s" onBackground="brand-medium" />
                </span>
                <span className={styles.methodText}>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {method.label}
                  </Text>
                  <Text variant="body-default-m">{method.value}</Text>
                </span>
              </a>
            ))}
          </Column>

          <Button href={`mailto:${person.email}`} variant="primary" size="m" fillWidth arrowIcon>
            Send me an email
          </Button>
        </Column>
        </div>
      </Panel>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.15}>
      <Panel accent="orange">
        <Column fillWidth gap="16" horizontal="center" align="center">
        <Text variant="label-default-s" onBackground="neutral-weak" className={styles.eyebrow}>
          Find me online
        </Text>
        <div className={styles.socialGrid}>
          {contact.socials.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
            >
              <Icon name={item.icon} size="m" onBackground="neutral-weak" />
              <Text variant="body-default-s">{item.label}</Text>
            </a>
          ))}
        </div>
        </Column>
      </Panel>
      </ScrollReveal>
    </Column>
  );
}
