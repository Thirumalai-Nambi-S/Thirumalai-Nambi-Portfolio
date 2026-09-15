"use client";

import { Text } from "@/once-ui/components";
import { iconLibrary } from "@/once-ui/icons";
import { getSkillMeta } from "@/app/utils/skillIcons";
import { useInView } from "@/once-ui/hooks/useInView";
import styles from "./SkillGrid.module.scss";

interface SkillGridProps {
  items: string[];
}

/**
 * Renders each skill as a small badge with a colorful brand/accent icon
 * on top and the label underneath, instead of once-ui's flat pill Tag
 * (icon-and-label side by side). Colors come from `skillIcons.ts` — real
 * brand colors for actual technologies, a themed accent for concepts
 * that don't have an official logo.
 *
 * The whole grid shares a single IntersectionObserver (via useInView);
 * once it scrolls into view, each tile pops in with a small stagger
 * based on its position, driven purely by CSS transition-delay.
 */
export function SkillGrid({ items }: SkillGridProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={[styles.grid, inView ? styles.revealed : ""].join(" ")}>
      {items.map((item, index) => {
        const { icon, color } = getSkillMeta(item);
        const IconComponent = iconLibrary[icon];

        return (
          <div
            key={item}
            className={styles.tile}
            style={{
              ["--tile-color" as any]: color,
              transitionDelay: `${Math.min(index, 14) * 0.04}s`,
            }}
          >
            <div className={styles.iconBadge}>
              {IconComponent && <IconComponent size={22} color={color} />}
            </div>
            <Text variant="label-default-s" align="center" className={styles.label}>
              {item}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
