"use client";

import { IconButton } from "@/once-ui/components";
import styles from "./ProjectLinks.module.scss";

interface ProjectLinksProps {
  docs?: string;
  link?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  size?: "s" | "m" | "l";
  onLinkClick?: (event: React.MouseEvent) => void;
}

export function ProjectLinks({
  docs,
  link,
  github,
  linkedin,
  youtube,
  size = "m",
  onLinkClick,
}: ProjectLinksProps) {
  const items = [
    { href: link, icon: "arrowUpRightFromSquare", tooltip: "Live project" },
    { href: github, icon: "github", tooltip: "GitHub repo" },
    { href: docs, icon: "book", tooltip: "Documentation" },
    { href: linkedin, icon: "linkedin", tooltip: "LinkedIn" },
    { href: youtube, icon: "youtube", tooltip: "YouTube channel" },
  ].filter((item) => item.href);

  if (items.length === 0) return null;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onLinkClick?.(event);
  };

  return (
    <div className={styles.row} onClick={handleClick}>
      {items.map((item) => (
        <IconButton
          key={item.icon}
          href={item.href}
          icon={item.icon}
          tooltip={item.tooltip}
          tooltipPosition="bottom"
          size={size}
          variant="secondary"
          data-border="rounded"
          className={styles.iconButton}
        />
      ))}
    </div>
  );
}
