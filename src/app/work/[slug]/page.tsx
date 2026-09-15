import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import { AvatarGroup, Button, Column, Flex, Heading, SmartImage, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Panel } from "@/components/Panel";
import styles from "./project.module.scss";

interface WorkParams {
  params: {
    slug: string;
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "work", "projects"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params: { slug } }: WorkParams) {
  let post = getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === slug);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    images,
    image,
    team,
  } = post.metadata;
  let ogImage = image ? `https://${baseURL}${image}` : `https://${baseURL}/og?title=${title}`;

  return {
    title,
    description,
    images,
    team,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `https://${baseURL}/work/${post.slug}`,
      images: [
        {
          url: ogImage,
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

export default function Project({ params }: WorkParams) {
  const sortedPosts = getPosts(["src", "app", "work", "projects"]).sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );
  let post = sortedPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const currentIndex = sortedPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = sortedPosts[(currentIndex - 1 + sortedPosts.length) % sortedPosts.length];
  const nextPost = sortedPosts[(currentIndex + 1) % sortedPosts.length];
  const hasMultipleProjects = sortedPosts.length > 1;

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `https://${baseURL}${post.metadata.image}`
              : `https://${baseURL}/og?title=${post.metadata.title}`,
            url: `https://${baseURL}/work/${post.slug}`,
            author: {
              "@type": "Person",
              name: person.name,
            },
          }),
        }}
      />
      <Column maxWidth="xs" gap="16">
        <Button href="/work" variant="tertiary" weight="default" size="s" prefixIcon="chevronLeft">
          Projects
        </Button>
        <Heading variant="display-strong-s">{post.metadata.title}</Heading>
      </Column>
      {post.metadata.images.length > 0 && (
        <SmartImage
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt="image"
          src={post.metadata.images[0]}
        />
      )}
      <Panel accent="cyan" title={post.metadata.title} icon="📄">
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <Flex gap="12" marginBottom="24" vertical="center">
          {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="m" />}
          <Text variant="body-default-s" onBackground="neutral-weak">
            {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
          </Text>
        </Flex>
        <CustomMDX source={post.content} />

        {hasMultipleProjects && (
          <Flex fillWidth gap="12" marginTop="40" wrap>
            <Button
              href={`/work/${prevPost.slug}`}
              variant="secondary"
              size="m"
              prefixIcon="chevronLeft"
              fillWidth
              style={{ justifyContent: "flex-start" }}
            >
              <Column gap="2" horizontal="start">
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  Previous project
                </Text>
                <Text variant="body-default-s">{prevPost.metadata.title}</Text>
              </Column>
            </Button>
            <Button
              href={`/work/${nextPost.slug}`}
              variant="secondary"
              size="m"
              suffixIcon="chevronRight"
              fillWidth
              style={{ justifyContent: "flex-end" }}
            >
              <Column gap="2" horizontal="end">
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  Next project
                </Text>
                <Text variant="body-default-s">{nextPost.metadata.title}</Text>
              </Column>
            </Button>
          </Flex>
        )}
      </Column>
      </Panel>

      {hasMultipleProjects && (
        <>
          <Button
            href={`/work/${prevPost.slug}`}
            variant="secondary"
            size="l"
            aria-label={`Previous project: ${prevPost.metadata.title}`}
            className={styles.projectNav}
            style={{ left: "24px" }}
          >
            ‹
          </Button>
          <Button
            href={`/work/${nextPost.slug}`}
            variant="secondary"
            size="l"
            aria-label={`Next project: ${nextPost.metadata.title}`}
            className={styles.projectNav}
            style={{ right: "24px" }}
          >
            ›
          </Button>
        </>
      )}

      <ScrollToHash />
    </Column>
  );
}
