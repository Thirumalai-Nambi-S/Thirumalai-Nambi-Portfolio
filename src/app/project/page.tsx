import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { ProjectDemos } from "@/components/project/ProjectDemos";
import { Panel } from "@/components/Panel";
import { baseURL } from "@/app/resources";
import { person, project } from "@/app/resources/content";

export async function generateMetadata() {
  const title = project.title;
  const description = project.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/project/`,
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

export default function Project() {
  const allProjects = getPosts(["src", "app", "work", "projects"]);

  return (
    <Column
  maxWidth="xl"
  horizontal="center"
  fillWidth
  style={{
    margin: "0 auto",
  }}
>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            headline: project.title,
            description: project.description,
            url: `https://${baseURL}/project`,
            image: `${baseURL}/og?title=${encodeURIComponent(project.title)}`,
            author: {
              "@type": "Person",
              name: person.name,
            },
            hasPart: allProjects.map((item) => ({
              "@type": "CreativeWork",
              headline: item.metadata.title,
              description: item.metadata.summary,
              url: `https://${baseURL}/work/${item.slug}`,
            })),
          }),
        }}
      />
      <Panel accent="cyan">
        <ProjectDemos />
      </Panel>
    </Column>
  );
}