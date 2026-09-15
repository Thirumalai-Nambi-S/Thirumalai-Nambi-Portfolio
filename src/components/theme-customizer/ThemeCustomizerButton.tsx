"use client";

import { useThemeCustomizer } from "@/contexts/ThemeCustomizerContext";
import { Icon } from "@/once-ui/components";
import styles from "./ThemeCustomizer.module.scss";

export function ThemeCustomizerButton() {
  const { toggleCustomizer, isOpen } = useThemeCustomizer();

  return (
    <button
      type="button"
      className={styles.fab}
      onClick={toggleCustomizer}
      aria-label="Open theme customizer"
      aria-expanded={isOpen}
      title="Customize theme"
    >
      <Icon name="gear" size="s" onBackground="neutral-strong" />
    </button>
  );
}
