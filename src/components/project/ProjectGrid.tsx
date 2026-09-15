"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  AvatarGroup,
  Button,
  Carousel,
  Heading,
  SmartImage,
  Tag,
  Text,
} from "@/once-ui/components";
import { useInView } from "@/once-ui/hooks/useInView";
import { ProjectLinks } from "./ProjectLinks";
import { person } from "@/app/resources/content";
import styles from "./ProjectGrid.module.scss";

// The creator's YouTube channel is the same across every project card,
// so it's applied here rather than duplicated in every .mdx file.
const YOUTUBE_CHANNEL = person.youtube;

// Cycled per row so the project list reads as colorful and varied
// rather than a single repeated brand tint.
const ROW_ACCENTS = ["#22D3EE", "#A78BFA", "#FB923C", "#34D399"];

export interface GridProject {
  slug: string;
  metadata: {
    title: string;
    summary: string;
    images: string[];
    team?: { name?: string; avatar: string }[];
    link?: string;
    github?: string;
    docs?: string;
    linkedin?: string;
    stack?: string[];
    highlights?: string[];
  };
}

interface ProjectGridProps {
  projects: GridProject[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Deep-link support: visiting /project?project=<slug> (e.g. from the
  // "Expand" button on an internship card) opens that project's modal
  // automatically once the grid mounts.
  useEffect(() => {
    const requested = searchParams?.get("project");
    if (requested && projects.some((p) => p.slug === requested)) {
      setActiveSlug(requested);
      // Strip the query param afterwards so refreshing/closing doesn't
      // keep re-triggering the modal, without adding a history entry.
      router.replace("/project", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [mounted, setMounted] = useState(false);
  const active = projects.find((p) => p.slug === activeSlug) || null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className={styles.list}>
        {projects.map((post, index) => (
          <ProjectRow
            key={post.slug}
            post={post}
            reversed={index % 2 === 1}
            priority={index < 1}
            accent={ROW_ACCENTS[index % ROW_ACCENTS.length]}
            onExpand={() => setActiveSlug(post.slug)}
          />
        ))}
      </div>

      {mounted &&
        active &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            onClick={() => setActiveSlug(null)}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setActiveSlug(null)}
                aria-label="Close"
              >
                ✕
              </button>
              <div className={styles.modalMedia}>
                <Carousel
                  sizes="(max-width: 960px) 100vw, 900px"
                  images={active.metadata.images.map((image) => ({
                    src: image,
                    alt: active.metadata.title,
                  }))}
                />
              </div>
              <div className={styles.modalBody}>
                <Heading as="h2" variant="heading-strong-xl" wrap="balance">
                  {active.metadata.title}
                </Heading>
                {active.metadata.team && active.metadata.team.length > 0 && (
                  <div className={styles.owner}>
                    <AvatarGroup
                      avatars={active.metadata.team.map((member) => ({ src: member.avatar }))}
                      size="s"
                      reverse
                    />
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {active.metadata.team.map((member) => member.name).filter(Boolean).join(" & ") ||
                        person.name}
                    </Text>
                  </div>
                )}
                {active.metadata.summary && (
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    {active.metadata.summary}
                  </Text>
                )}
                {active.metadata.stack && active.metadata.stack.length > 0 && (
                  <div className={styles.tags}>
                    {active.metadata.stack.map((tech) => (
                      <Tag key={tech} size="m" variant="brand" label={tech} />
                    ))}
                  </div>
                )}

                {/* More detail, surfaced lower in the modal so the top
                    stays a quick, scannable summary. */}
                {active.metadata.highlights && active.metadata.highlights.length > 0 && (
                  <div className={styles.modalDetails}>
                    <Text
                      variant="label-strong-s"
                      onBackground="neutral-weak"
                      className={styles.modalDetailsLabel}
                    >
                      Key Highlights
                    </Text>
                    <ul className={styles.highlightList}>
                      {active.metadata.highlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.modalActions}>
                  <a className={styles.caseStudyLink} href={`/work/${active.slug}`}>
                    Read full case study →
                  </a>
                  <ProjectLinks
                    docs={active.metadata.docs}
                    link={active.metadata.link}
                    github={active.metadata.github}
                    linkedin={active.metadata.linkedin}
                    youtube={YOUTUBE_CHANNEL}
                    size="m"
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

interface ProjectRowProps {
  post: GridProject;
  reversed: boolean;
  priority: boolean;
  accent: string;
  onExpand: () => void;
}

/**
 * A single alternating video/details row. Odd rows (index 1, 3, ...)
 * are mirrored — video on the right, details on the left — so the
 * project list reads as a zigzag rather than a flat repeating stack.
 * Reveals with a fade + horizontal slide the first time it scrolls
 * into view.
 */
function ProjectRow({ post, reversed, priority, accent, onExpand }: ProjectRowProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={[
        styles.row,
        reversed ? styles.rowReversed : "",
        inView ? styles.rowVisible : "",
      ].join(" ")}
      style={{ ["--row-accent" as any]: accent }}
    >
      <div
        role="button"
        tabIndex={0}
        className={styles.media}
        onClick={onExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onExpand();
          }
        }}
        aria-label={`Expand ${post.metadata.title}`}
      >
        {post.metadata.images?.[0] && (
          <SmartImage
            src={post.metadata.images[0]}
            alt={post.metadata.title}
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            priority={priority}
          />
        )}
        <div className={styles.mediaOverlay}>
          <span className={styles.expandBadge}>⤢ Expand</span>
        </div>
      </div>

      <div className={styles.body}>
        <Heading as="h3" variant="heading-strong-l" wrap="balance" align="left">
          {post.metadata.title}
        </Heading>
        {post.metadata.team && post.metadata.team.length > 0 && (
          <div className={styles.owner}>
            <Avatar src={post.metadata.team[0].avatar} size="xs" />
            <Text variant="label-default-s" onBackground="neutral-weak">
              {post.metadata.team[0].name || person.name}
            </Text>
          </div>
        )}
        {post.metadata.summary && (
          <Text variant="body-default-m" onBackground="neutral-weak" align="left">
            {post.metadata.summary}
          </Text>
        )}
        {post.metadata.stack && post.metadata.stack.length > 0 && (
          <div className={styles.tags}>
            {post.metadata.stack.slice(0, 5).map((tech) => (
              <Tag key={tech} size="s" variant="neutral" label={tech} />
            ))}
          </div>
        )}

        <div className={styles.bodyFooter}>
          <ProjectLinks
            docs={post.metadata.docs}
            link={post.metadata.link}
            github={post.metadata.github}
            linkedin={post.metadata.linkedin}
            youtube={YOUTUBE_CHANNEL}
            size="s"
          />
          <Button
            size="s"
            variant="secondary"
            label="Expand"
            arrowIcon
            onClick={onExpand}
          />
        </div>
      </div>
    </div>
  );
}
