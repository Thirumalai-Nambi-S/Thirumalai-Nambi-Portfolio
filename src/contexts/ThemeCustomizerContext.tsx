"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ToneChoice = "auto" | "cyan" | "emerald" | "blood" | "teal" | "bloodcyan";
export type CursorShape = "circle" | "square" | "diamond" | "ring";
export type CursorSize = "small" | "medium" | "large";
export type SurfaceMode = "opaque" | "translucent" | "transparent";
export type SpotlightLevel = "soft" | "balanced" | "vivid";

export interface ThemeSettings {
  /** "auto" = every page uses its own colour; anything else locks one tone site-wide. */
  tone: ToneChoice;
  surfaceMode: SurfaceMode;
  /** "auto" follows the tone; otherwise a hex colour. */
  cursorColor: string;
  cursorShape: CursorShape;
  cursorSize: CursorSize;
  spotlight: SpotlightLevel;
  activePreset: string;
}

export interface ThemePreset {
  label: string;
  description: string;
  tone: ToneChoice;
  /** three swatches used for the preview orb on the card */
  swatch: [string, string, string];
}

// Six Liquid Glass themes. "Spectrum" lets every page glow in its own colour;
// the rest lock one muted colour (or a mix of two) across the whole site.
export const THEME_PRESETS: Record<string, ThemePreset> = {
  spectrum: {
    label: "Spectrum",
    description: "Every page glows in its own colour.",
    tone: "auto",
    swatch: ["#2FA7B8", "#2FA882", "#B8404E"],
  },
  "cyan-mist": {
    label: "Cyan Mist",
    description: "Cool, calm and crystal clear.",
    tone: "cyan",
    swatch: ["#2FA7B8", "#2A79AD", "#0C3446"],
  },
  "emerald-veil": {
    label: "Emerald Veil",
    description: "Deep green light through frosted glass.",
    tone: "emerald",
    swatch: ["#2FA882", "#1F8C6C", "#0B3629"],
  },
  "crimson-haze": {
    label: "Crimson Haze",
    description: "A smouldering blood-red glow.",
    tone: "blood",
    swatch: ["#B8404E", "#8A2335", "#3D0D16"],
  },
  lagoon: {
    label: "Lagoon",
    description: "Cyan melting into emerald.",
    tone: "teal",
    swatch: ["#2BA99C", "#2A83B0", "#0C3A42"],
  },
  eclipse: {
    label: "Eclipse",
    description: "Crimson edge, cyan core.",
    tone: "bloodcyan",
    swatch: ["#B8404E", "#2799AB", "#2A1026"],
  },
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  tone: "auto",
  surfaceMode: "translucent",
  cursorColor: "auto",
  cursorShape: "circle",
  cursorSize: "medium",
  spotlight: "balanced",
  activePreset: "spectrum",
};

const STORAGE_KEY = "portfolio-theme-settings-v3";

interface ThemeCustomizerContextValue {
  settings: ThemeSettings;
  updateSettings: (partial: Partial<ThemeSettings>) => void;
  applyPreset: (presetId: string) => void;
  resetToDefaults: () => void;
  isOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextValue | null>(null);

function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16,
  );
  if (Number.isNaN(bigint)) return "47, 167, 184";
  return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
}

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted settings once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      // Corrupt or inaccessible storage — fall back to defaults silently.
    }
    setHydrated(true);
  }, []);

  // Apply settings to the document and persist them.
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;

    root.setAttribute("data-app-surface", settings.surfaceMode);
    root.setAttribute("data-cursor-shape", settings.cursorShape);
    root.setAttribute("data-cursor-size", settings.cursorSize);
    root.setAttribute("data-spot", settings.spotlight);
    root.setAttribute("data-surface", settings.surfaceMode === "opaque" ? "filled" : "translucent");

    // The spotlight follows the page tone unless a custom colour was chosen.
    if (settings.cursorColor !== "auto") {
      root.style.setProperty("--user-cursor-rgb", hexToRgbTriplet(settings.cursorColor));
      root.style.setProperty("--user-cursor-color", settings.cursorColor);
    } else {
      root.style.removeProperty("--user-cursor-rgb");
      root.style.removeProperty("--user-cursor-color");
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage full/unavailable — settings just won't persist this time.
    }
  }, [settings, hydrated]);

  const updateSettings = (partial: Partial<ThemeSettings>) => setSettings((prev) => ({ ...prev, ...partial }));

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS[presetId];
    if (!preset) return;
    setSettings((prev) => ({ ...prev, tone: preset.tone, cursorColor: "auto", activePreset: presetId }));
  };

  const resetToDefaults = () => setSettings(DEFAULT_THEME_SETTINGS);

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      applyPreset,
      resetToDefaults,
      isOpen,
      openCustomizer: () => setIsOpen(true),
      closeCustomizer: () => setIsOpen(false),
      toggleCustomizer: () => setIsOpen((prev) => !prev),
    }),
    [settings, isOpen],
  );

  return <ThemeCustomizerContext.Provider value={value}>{children}</ThemeCustomizerContext.Provider>;
}

export function useThemeCustomizer() {
  const ctx = useContext(ThemeCustomizerContext);
  if (!ctx) {
    throw new Error("useThemeCustomizer must be used within a ThemeCustomizerProvider");
  }
  return ctx;
}
