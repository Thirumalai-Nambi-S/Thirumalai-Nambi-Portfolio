"use client";

import { Column, Heading, Icon, Text } from "@/once-ui/components";
import { useInView } from "@/once-ui/hooks/useInView";
import styles from "./GithubRepoGrid.module.scss";

interface Repo {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  license?: string;
  updated: string;
  url: string;
}

interface GithubRepoGridProps {
  title: string;
  description: string;
  repos: Repo[];
  profile: string;
}

export function GithubRepoGrid({ title, description, repos, profile }: GithubRepoGridProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.08 });

  return (
    <Column fillWidth gap="l" horizontal="center">
      <Column fillWidth gap="8" horizontal="center" align="center">
        <Heading as="h2" variant="display-strong-xs" wrap="balance" align="center">
          {title}
        </Heading>
        <Text
          variant="body-default-m"
          onBackground="neutral-weak"
          align="center"
          style={{ maxWidth: "560px" }}
        >
          {description}
        </Text>
      </Column>

      <div
        ref={ref}
        className={[styles.grid, inView ? styles.gridRevealed : ""].join(" ")}
      >
        {repos.map((repo, index) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
            style={{ ["--card-delay" as any]: `${index * 0.07}s` }}
          >
            <div className={styles.cardHeader}>
              <Icon name="github" size="s" onBackground="neutral-weak" />
              <span className={styles.repoName}>{repo.name}</span>
            </div>
            <p className={styles.repoDescription}>{repo.description}</p>
            <div className={styles.cardFooter}>
              {repo.language && (
                <span className={styles.language}>
                  <span
                    className={styles.languageDot}
                    style={{ background: repo.languageColor }}
                  />
                  {repo.language}
                </span>
              )}
              {repo.stars > 0 && <span className={styles.stat}>★ {repo.stars}</span>}
              {repo.license && <span className={styles.stat}>{repo.license}</span>}
              <span className={styles.updated}>{repo.updated}</span>
            </div>
          </a>
        ))}
      </div>

      <a href={profile} target="_blank" rel="noopener noreferrer" className={styles.viewAll}>
        View full GitHub profile →
      </a>
    </Column>
  );
}
