import React from "react";
import styles from "./Panel.module.scss";

type Accent = "cyan" | "violet" | "orange" | "emerald";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Brand accent used for the border glow and (if present) header bar. */
  accent?: Accent;
  /** Optional title — when set, renders a mac-style dot header bar above the content. */
  title?: string;
  /** Optional emoji/icon shown before the title. */
  icon?: string;
  className?: string;
  /** Set true to remove the default inner padding (e.g. content already has its own). */
  noPadding?: boolean;
}

/**
 * Shared "laminated card" frame — a bordered, glowing, translucent panel
 * matching the games section's look. Wrap any section in this instead of
 * placing it directly on the flat page background.
 */
export function Panel({
  children,
  accent = "cyan",
  title,
  icon,
  className,
  noPadding = false,
  ...rest
}: PanelProps) {
  return (
    <div
      className={[styles.panel, className].filter(Boolean).join(" ")}
      data-accent={accent}
      {...rest}
    >
      {title && (
        <div className={styles.panelHeader}>
          <span className={styles.panelDot} />
          <span className={styles.panelDot} />
          <span className={styles.panelDot} />
          <span className={styles.panelTitle}>
            {icon ? `${icon} ` : ""}
            {title}
          </span>
        </div>
      )}
      <div className={noPadding ? styles.panelBodyFlush : styles.panelBody}>
        {children}
      </div>
    </div>
  );
}
