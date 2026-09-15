"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SchemeColor =
  | "blue"
  | "indigo"
  | "violet"
  | "magenta"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "moss"
  | "green"
  | "emerald"
  | "aqua"
  | "cyan";

export type NeutralColor = "sand" | "gray" | "slate";
export type CursorShape = "circle" | "square" | "diamond" | "ring";
export type CursorSize = "small" | "medium" | "large";
export type SurfaceMode = "opaque" | "translucent" | "transparent";

export interface ThemeSettings {
  brand: SchemeColor;
  accent: SchemeColor;
  neutral: NeutralColor;
  surfaceMode: SurfaceMode;
  cursorColor: string;
  cursorShape: CursorShape;
  cursorSize: CursorSize;
  activePreset: string | null;
}

export interface ThemePreset {
  label: string;
  description: string;
  brand: SchemeColor;
  accent: SchemeColor;
  neutral: NeutralColor;
  surfaceMode: SurfaceMode;
  cursorColor: string;
}

// Built-in themes. The first five match what was asked for by name; the
// last three lean into the "anime fan" ask with palettes referencing
// well-known series without using any character names or copyrighted
// terms directly.
export const THEME_PRESETS: Record<string, ThemePreset> = {
  "sun-theme": {
    label: "Sun Theme",
    description: "Warm gold and amber, bright and energetic.",
    brand: "orange",
    accent: "yellow",
    neutral: "sand",
    surfaceMode: "transparent",
    cursorColor: "#FFC857",
  },
  "moon-theme": {
    label: "Moon Theme",
    description: "Cool indigo and silver, calm and quiet.",
    brand: "indigo",
    accent: "violet",
    neutral: "slate",
    surfaceMode: "transparent",
    cursorColor: "#C7D2FE",
  },
  "ocean-theme": {
    label: "Ocean Theme",
    description: "Deep cyan and aqua, the original site palette.",
    brand: "cyan",
    accent: "aqua",
    neutral: "slate",
    surfaceMode: "transparent",
    cursorColor: "#22D3EE",
  },
  "fire-theme": {
    label: "Fire Theme",
    description: "Bold red and orange, high contrast and intense.",
    brand: "red",
    accent: "orange",
    neutral: "gray",
    surfaceMode: "transparent",
    cursorColor: "#FB7185",
  },
  "dark-magic-theme": {
    label: "Dark Magic Theme",
    description: "Violet and magenta over a near-transparent surface.",
    brand: "violet",
    accent: "magenta",
    neutral: "slate",
    surfaceMode: "transparent",
    cursorColor: "#C084FC",
  },
  "sharingan-theme": {
    label: "Sharingan Theme",
    description: "Crimson red on black — for the anime fans.",
    brand: "red",
    accent: "red",
    neutral: "gray",
    surfaceMode: "transparent",
    cursorColor: "#EF4444",
  },
  "super-saiyan-theme": {
    label: "Super Saiyan Theme",
    description: "Golden yellow with an orange edge.",
    brand: "yellow",
    accent: "orange",
    neutral: "sand",
    surfaceMode: "transparent",
    cursorColor: "#FDE047",
  },
  "straw-hat-theme": {
    label: "Straw Hat Theme",
    description: "Sky blue and red, adventurous and bright.",
    brand: "blue",
    accent: "red",
    neutral: "sand",
    surfaceMode: "transparent",
    cursorColor: "#60A5FA",
  },
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  brand: "cyan",
  accent: "violet",
  neutral: "gray",
  surfaceMode: "transparent",
  cursorColor: "#22D3EE",
  cursorShape: "circle",
  cursorSize: "medium",
  activePreset: null,
};

const STORAGE_KEY = "portfolio-theme-settings";

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
    16
  );
  if (Number.isNaN(bigint)) return "34, 211, 238";
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted settings once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Corrupt or inaccessible storage — fall back to defaults silently.
    }
    setHydrated(true);
  }, []);

  // Apply settings to the document (data-attributes + CSS variables) and
  // persist them, any time they change.
  useEffect(() => {
    if (!hydrated) return;

    const root = document.documentElement;
    root.setAttribute("data-brand", settings.brand);
    root.setAttribute("data-accent", settings.accent);
    root.setAttribute("data-neutral", settings.neutral);
    root.setAttribute("data-app-surface", settings.surfaceMode);
    root.setAttribute("data-cursor-shape", settings.cursorShape);
    root.setAttribute("data-cursor-size", settings.cursorSize);
    root.style.setProperty("--user-cursor-rgb", hexToRgbTriplet(settings.cursorColor));
    root.style.setProperty("--user-cursor-color", settings.cursorColor);

    // once-ui's own two-state surface token — "opaque" maps to its
    // "filled" state, "translucent"/"transparent" both use its
    // "translucent" state (the extra transparency for our third state
    // is layered on top via the data-app-surface rules in global.scss).
    root.setAttribute("data-surface", settings.surfaceMode === "opaque" ? "filled" : "translucent");

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage full/unavailable — settings just won't persist this time.
    }
  }, [settings, hydrated]);

  const updateSettings = (partial: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial, activePreset: null }));
  };

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS[presetId];
    if (!preset) return;
    setSettings((prev) => ({
      ...prev,
      brand: preset.brand,
      accent: preset.accent,
      neutral: preset.neutral,
      surfaceMode: preset.surfaceMode,
      cursorColor: preset.cursorColor,
      activePreset: presetId,
    }));
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
    [settings, isOpen]
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
