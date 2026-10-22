"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toneForPath, TONES } from "@/app/resources/tones";
import { useThemeCustomizer } from "@/contexts/ThemeCustomizerContext";

/**
 * Applies the current colour tone to <html> (data-tone, plus the once-ui
 * brand / accent scales). In "Spectrum" (auto) mode every page gets its own
 * colour; picking any other theme in the Theme Studio locks one tone site-wide.
 */
export function PageTone() {
  const pathname = usePathname();
  const { settings } = useThemeCustomizer();

  useEffect(() => {
    const root = document.documentElement;
    const locked = settings.tone !== "auto" ? (TONES.tones as Record<string, any>)[settings.tone] : null;
    const tone = locked ?? toneForPath(pathname);
    root.setAttribute("data-tone", tone.tone);
    root.setAttribute("data-brand", tone.brand);
    root.setAttribute("data-accent", tone.accent);
  }, [pathname, settings.tone]);

  return null;
}
