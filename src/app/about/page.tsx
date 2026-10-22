import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heading, Icon, SmartImage, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { SectionNav, type SectionNavItem } from "@/components/about/SectionNav";
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

const ACCENT = {
  intro: "#3fb894",
  work: "#35b3a8",
  studies: "#4dbb82",
  skills: "#3aa9c0",
  repos: "#46bd9d",
};

type SectionHeadProps = {
  index: number;
  icon: string;
  title: string;
  subtitle?: string;
  accent: string;
};

function SectionHead({ index, icon, title, subtitle, accent }: SectionHeadProps) {
  return (
    <header className={styles.sectionHead}>
      <span className={styles.sectionIcon} style={{ color: accent }}>
        <Icon name={icon} size="m" />
      </span>
      <div className={styles.sectionHeadText}>
        <p className={styles.sectionKicker} style={{ color: accent }}>
          {String(index).padStart(2, "0")}
          {subtitle ? <span> · {subtitle}</span> : null}
        </p>
        <Heading as="h2" variant="display-strong-s" className={styles.sectionTitle}>
          {title}
        </Heading>
      </div>
    </header>
  );
}

export default function About() {
  const navItems: SectionNavItem[] = [
    about.intro.display && { id: "introduction", label: about.intro.title, accent: ACCENT.intro },
    about.work.display && { id: "experience", label: about.work.title, accent: ACCENT.work },
    about.studies.display && { id: "studies", label: about.studies.title, accent: ACCENT.studies },
    about.technical.display && { id: "skills", label: about.technical.title, accent: ACCENT.skills },
    about.repoSkills?.display && { id: "repositories", label: "Repository skills", accent: ACCENT.repos },
  ].filter(Boolean) as SectionNavItem[];

  const num = (id: string) => navItems.findIndex((n) => n.id === id) + 1;
  const socials = social.filter((item) => item.link);

  return (
    <div className={styles.wrap}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: person.name,
            jobTitle: person.role,
            description: about.description,
            url: `https://${baseURL}/about`,
            image: `${baseURL}/images/${person.avatar}`,
            sameAs: social
              .filter((item) => item.link && !item.link.startsWith("mailto:"))
              .map((item) => item.link),
            worksFor: {
              "@type": "Organization",
              name: about.work.experiences[0].company || "",
            },
          }),
        }}
      />

      <div className={styles.layout}>
        {/* ─────────────── Sidebar ─────────────── */}
        <aside className={styles.sidebar}>
          {about.avatar.display && (
            <ScrollReveal direction="left">
              <div className={styles.profileCard}>
                <div className={styles.profilePhoto}>
                  <Image
                    src={person.avatar}
                    alt={person.name.trim()}
                    fill
                    priority
                    sizes="160px"
                    className={styles.profilePhotoImg}
                  />
                </div>

                <div className={styles.profileInfo}>
                  <p className={styles.profileName}>{person.name.trim()} S</p>
                  <div className={styles.profileMeta}>
                    <Icon name="location" size="xs" onBackground="accent-weak" />
                    <span>{person.city}</span>
                    <span className={styles.metaDot} aria-hidden="true">·</span>
                    <span>{person.location}</span>
                  </div>

                  {person.languages.length > 0 && (
                    <ul className={styles.chips}>
                      {person.languages.map((language) => (
                        <li key={language}>{language}</li>
                      ))}
                    </ul>
                  )}

                  <p className={styles.openBadge}>
                    <span className={styles.pulse} aria-hidden="true" /> Open to work
                  </p>

                  {socials.length > 0 && (
                    <div className={styles.socialRow}>
                      {socials.map((item) => (
                        <a
                          key={item.name}
                          href={item.link}
                          target={item.link.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          aria-label={item.name}
                          title={item.name}
                          className={styles.socialBtn}
                        >
                          <Icon name={item.icon} size="s" />
                        </a>
                      ))}
                    </div>
                  )}

                  <a href={person.resume} download className={`${styles.btn} ${styles.btnPrimary}`}>
                    Download Resume
                  </a>
                </div>
              </div>
            </ScrollReveal>
          )}

          {about.tableOfContent.display && navItems.length > 0 && <SectionNav items={navItems} />}
        </aside>

        {/* ─────────────── Content ─────────────── */}
        <div className={styles.content}>
          {/* 01 — Introduction */}
          {about.intro.display && (
            <ScrollReveal direction="up">
              <section
                id="introduction"
                className={styles.section}
                style={{ ["--accent" as string]: ACCENT.intro } as React.CSSProperties}
              >
                <p className={styles.eyebrow}>About me</p>
                <Heading as="h1" variant="display-strong-xl" className={styles.pageName}>
                  <span className={styles.nameGradient}>{person.name.trim()} S</span>
                </Heading>
                <p className={styles.role}>{person.role}</p>

                <p className={styles.lead}>{about.summary}</p>

                <ul className={styles.focusGrid}>
                  {about.focus.map((f) => (
                    <li key={f.title} className={styles.focusCard}>
                      <span className={styles.focusIcon}>
                        <Icon name={f.icon} size="m" />
                      </span>
                      <h3>{f.title}</h3>
                      <p>{f.description}</p>
                    </li>
                  ))}
                </ul>

                <div className={styles.statusBar}>
                  <p>
                    <span className={styles.pulse} aria-hidden="true" /> {about.status}
                  </p>
                  <div className={styles.statusActions}>
                    <Link href="/contact" className={`${styles.btn} ${styles.btnPrimary}`}>
                      Get in touch
                    </Link>
                    <Link href="/project" className={`${styles.btn} ${styles.btnGhost}`}>
                      See my work
                    </Link>
                  </div>
                </div>

                <details className={styles.more}>
                  <summary>Read the full introduction</summary>
                  <Text as="p" variant="body-default-m" className={styles.moreText}>
                    {about.intro.description}
                  </Text>
                </details>
              </section>
            </ScrollReveal>
          )}

          {/* 02 — Experience */}
          {about.work.display && (
            <ScrollReveal direction="up">
              <section
                id="experience"
                className={styles.section}
                style={{ ["--accent" as string]: ACCENT.work } as React.CSSProperties}
              >
                <SectionHead
                  index={num("experience")}
                  icon="stack"
                  title={about.work.title}
                  subtitle="Internships"
                  accent={ACCENT.work}
                />
                <ol className={styles.timeline}>
                  {about.work.experiences.map((experience, index) => (
                    <li key={`${experience.company}-${index}`} className={styles.job}>
                      <span className={styles.timelineDot} aria-hidden="true" />
                      <div className={styles.jobHead}>
                        <div>
                          <h3 id={experience.company} className={styles.jobCompany}>
                            {experience.company}
                          </h3>
                          <p className={styles.jobRole}>{experience.role}</p>
                        </div>
                        <span className={styles.dateChip}>{experience.timeframe}</span>
                      </div>
                      <ul className={styles.checkList}>
                        {experience.achievements.map((achievement: React.ReactNode, i: number) => (
                          <li key={`${experience.company}-${i}`}>{achievement}</li>
                        ))}
                      </ul>
                      {experience.images.length > 0 && (
                        <div className={styles.jobImages}>
                          {experience.images.map((image, i) => (
                            <div
                              key={i}
                              className={styles.jobImage}
                              //@ts-ignore
                              style={{ minWidth: image.width, height: image.height }}
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
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </ScrollReveal>
          )}

          {/* 03 — Studies */}
          {about.studies.display && (
            <ScrollReveal direction="up">
              <section
                id="studies"
                className={styles.section}
                style={{ ["--accent" as string]: ACCENT.studies } as React.CSSProperties}
              >
                <SectionHead
                  index={num("studies")}
                  icon="book"
                  title={about.studies.title}
                  subtitle="Education"
                  accent={ACCENT.studies}
                />
                <ul className={styles.eduList}>
                  {about.studies.institutions.map((institution, index) => {
                    const [first, ...rest] = institution.description.split(" · ");
                    return (
                      <li key={`${institution.name}-${index}`} className={styles.edu}>
                        <h3 id={institution.name} className={styles.eduName}>
                          {institution.name}
                        </h3>
                        <p className={styles.eduDesc}>{first}</p>
                        {rest.length > 0 && (
                          <ul className={styles.chips}>
                            {rest.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </ScrollReveal>
          )}

          {/* 04 — Technical skills */}
          {about.technical.display && (
            <ScrollReveal direction="up">
              <section
                id="skills"
                className={styles.section}
                style={{ ["--accent" as string]: ACCENT.skills } as React.CSSProperties}
              >
                <SectionHead
                  index={num("skills")}
                  icon="code"
                  title={about.technical.title}
                  subtitle="Toolbox"
                  accent={ACCENT.skills}
                />
                <div className={styles.techSkillGrid}>
                  {about.technical.skills.map(
                    (skill: { title: string; icon?: string; description: React.ReactNode }, index: number) => {
                      const palette = ["#3fb894", "#3aa9c0", "#4dbb82", "#35b3a8"];
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
                          <h3>{skill.title}</h3>
                          <p>{skill.description}</p>
                        </div>
                      );
                    },
                  )}
                </div>

                {about.technical.categories && about.technical.categories.length > 0 && (
                  <div className={styles.categories}>
                    {about.technical.categories.map(
                      (category: { title: string; items: string[] }, index: number) => (
                        <div key={`${category.title}-${index}`} className={styles.category}>
                          <p className={styles.categoryTitle}>
                            {category.title}
                            <span>{category.items.length}</span>
                          </p>
                          <SkillGrid items={category.items} />
                        </div>
                      ),
                    )}
                  </div>
                )}
              </section>
            </ScrollReveal>
          )}

          {/* 05 — Repository skills */}
          {about.repoSkills?.display && (
            <ScrollReveal direction="up">
              <section
                id="repositories"
                className={styles.section}
                style={{ ["--accent" as string]: ACCENT.repos } as React.CSSProperties}
              >
                <SectionHead
                  index={num("repositories")}
                  icon="github"
                  title={about.repoSkills.title}
                  subtitle="GitHub"
                  accent={ACCENT.repos}
                />
                <p className={styles.sectionLead}>{about.repoSkills.description}</p>
                <div className={styles.repoSkillGrid}>
                  {about.repoSkills.repos.map((repo: { name: string; url?: string; skills: string[] }) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.repoSkillCard}
                    >
                      <span className={styles.repoHead}>
                        <Icon name="github" size="s" />
                        <span className={styles.repoName}>{repo.name}</span>
                        <Icon name="arrowUpRightFromSquare" size="xs" />
                      </span>
                      <span className={styles.repoTags}>
                        {repo.skills.map((skill: string) => (
                          <span key={skill} className={styles.repoTag}>
                            {skill}
                          </span>
                        ))}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}
