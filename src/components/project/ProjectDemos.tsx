import { getPosts } from "@/app/utils/utils";
import { project, githubRepos } from "@/app/resources/content";
import { Column, Heading, ScrollReveal, Text } from "@/once-ui/components";
import { Suspense } from "react";
import { ProjectGrid } from "./ProjectGrid";
import { GithubRepoGrid } from "./GithubRepoGrid";

interface ProjectDemosProps {
  range?: [number, number?];
}

export function ProjectDemos({ range }: ProjectDemosProps) {
  const allProjects = getPosts(["src", "app", "work", "projects"]);

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l" horizontal="center">
      <ScrollReveal direction="blur">
        <Column fillWidth gap="8" paddingTop="l" horizontal="center" align="center">
          <Heading as="h1" variant="display-strong-m" wrap="balance" align="center">
            {project.title}
          </Heading>
          <Text
            variant="heading-default-m"
            onBackground="neutral-weak"
            wrap="balance"
            align="center"
            style={{ maxWidth: "760px" }}
          >
            {project.description}
          </Text>
        </Column>
      </ScrollReveal>

      <Suspense fallback={null}>
        <ProjectGrid projects={displayedProjects} />
      </Suspense>

      <ScrollReveal direction="up" delay={0.05}>
        <GithubRepoGrid
          title={githubRepos.title}
          description={githubRepos.description}
          repos={githubRepos.repos}
          profile={githubRepos.profile}
        />
      </ScrollReveal>
    </Column>
  );
}
