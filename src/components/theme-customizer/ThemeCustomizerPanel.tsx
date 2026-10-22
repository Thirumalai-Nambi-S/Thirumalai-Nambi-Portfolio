"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CursorShape,
  CursorSize,
  SpotlightLevel,
  SurfaceMode,
  THEME_PRESETS,
  useThemeCustomizer,
} from "@/contexts/ThemeCustomizerContext";
import styles from "./ThemeCustomizer.module.scss";

const CURSOR_COLOR_PRESETS = [
  { hex: "#2FA7B8", label: "Cyan" },
  { hex: "#2FA882", label: "Emerald" },
  { hex: "#C8404F", label: "Crimson" },
  { hex: "#FB7185", label: "Rose" },
  { hex: "#A78BFA", label: "Violet" },
  { hex: "#F5B14C", label: "Amber" },
  { hex: "#CFE8FF", label: "Ice" },
];

const CURSOR_SHAPES: { value: CursorShape; label: string; icon: string }[] = [
  { value: "circle", label: "Circle", icon: "○" },
  { value: "square", label: "Square", icon: "□" },
  { value: "diamond", label: "Diamond", icon: "◇" },
  { value: "ring", label: "Ring", icon: "◎" },
];

const CURSOR_SIZES: { value: CursorSize; label: string; size: number }[] = [
  { value: "small", label: "Small", size: 8 },
  { value: "medium", label: "Medium", size: 12 },
  { value: "large", label: "Large", size: 16 },
];

const SPOT_LEVELS: { value: SpotlightLevel; label: string; hint: string }[] = [
  { value: "soft", label: "Soft", hint: "Subtle" },
  { value: "balanced", label: "Balanced", hint: "Default" },
  { value: "vivid", label: "Vivid", hint: "Bold" },
];

const SURFACE_MODES: { value: SurfaceMode; label: string; hint: string; fill: number }[] = [
  { value: "transparent", label: "Clear", hint: "Barely there", fill: 0.04 },
  { value: "translucent", label: "Frosted", hint: "Liquid glass", fill: 0.09 },
  { value: "opaque", label: "Dense", hint: "Deep tint", fill: 0.22 },
];

type TabId = "themes" | "spotlight" | "glass";

export function ThemeCustomizerPanel() {
  const { settings, updateSettings, applyPreset, resetToDefaults, isOpen, closeCustomizer } = useThemeCustomizer();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("themes");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCustomizer();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCustomizer]);

  if (!mounted || !isOpen) return null;

  const tabs: { id: TabId; label: string; glyph: string }[] = [
    { id: "themes", label: "Themes", glyph: "◐" },
    { id: "spotlight", label: "Spotlight", glyph: "✦" },
    { id: "glass", label: "Glass", glyph: "◈" },
  ];

  return createPortal(
    <div className={styles.backdrop} onClick={closeCustomizer} role="dialog" aria-modal="true" aria-label="Theme Studio">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className={styles.panelHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.headerOrb} aria-hidden="true" />
            <div>
              <div className={styles.headerTitle}>Theme Studio</div>
              <div className={styles.headerSub}>Tune the light, colour and glass</div>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={closeCustomizer} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabBar} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={[styles.tab, activeTab === tab.id ? styles.tabActive : ""].join(" ")}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabGlyph} aria-hidden="true">
                {tab.glyph}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className={styles.panelBody}>
          {activeTab === "themes" && (
            <div className={styles.tabContent}>
              <p className={styles.tabDescription}>Pick a light for the whole portfolio.</p>
              <div className={styles.presetGrid}>
                {Object.entries(THEME_PRESETS).map(([id, preset]) => {
                  const isActive = settings.activePreset === id;
                  const [a, b, c] = preset.swatch;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={[styles.presetCard, isActive ? styles.presetActive : ""].join(" ")}
                      onClick={() => applyPreset(id)}
                      aria-pressed={isActive}
                      style={{ ["--pa" as string]: a, ["--pb" as string]: b, ["--pc" as string]: c } as React.CSSProperties}
                    >
                      <span className={styles.presetOrb} aria-hidden="true" />
                      <span className={styles.presetInfo}>
                        <span className={styles.presetName}>{preset.label}</span>
                        <span className={styles.presetDesc}>{preset.description}</span>
                      </span>
                      {isActive && (
                        <span className={styles.presetCheck} aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "spotlight" && (
            <div className={styles.tabContent}>
              <p className={styles.tabDescription}>The cursor spotlight is the main light source of the site.</p>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldTitle}>Colour</div>
                <div className={styles.colorGrid}>
                  <button
                    type="button"
                    title="Auto — follows the page colour"
                    className={[styles.colorDot, styles.colorAuto, settings.cursorColor === "auto" ? styles.colorDotActive : ""].join(" ")}
                    onClick={() => updateSettings({ cursorColor: "auto" })}
                  >
                    <span>A</span>
                  </button>
                  {CURSOR_COLOR_PRESETS.map(({ hex, label }) => (
                    <button
                      key={hex}
                      type="button"
                      title={label}
                      className={[
                        styles.colorDot,
                        settings.cursorColor.toLowerCase() === hex.toLowerCase() ? styles.colorDotActive : "",
                      ].join(" ")}
                      style={{ background: hex, ["--glow" as string]: hex } as React.CSSProperties}
                      onClick={() => updateSettings({ cursorColor: hex })}
                    />
                  ))}
                  <label className={styles.colorPicker} title="Custom colour">
                    <span>+</span>
                    <input
                      type="color"
                      value={settings.cursorColor === "auto" ? "#2fa7b8" : settings.cursorColor}
                      onChange={(e) => updateSettings({ cursorColor: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldTitle}>Intensity</div>
                <div className={styles.segRow}>
                  {SPOT_LEVELS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      className={[styles.seg, settings.spotlight === l.value ? styles.segActive : ""].join(" ")}
                      onClick={() => updateSettings({ spotlight: l.value })}
                    >
                      <span className={styles.segMain}>{l.label}</span>
                      <span className={styles.segHint}>{l.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldTitle}>Shape</div>
                <div className={styles.segRow}>
                  {CURSOR_SHAPES.map((shape) => (
                    <button
                      key={shape.value}
                      type="button"
                      className={[styles.seg, settings.cursorShape === shape.value ? styles.segActive : ""].join(" ")}
                      onClick={() => updateSettings({ cursorShape: shape.value })}
                    >
                      <span className={styles.segIcon}>{shape.icon}</span>
                      <span className={styles.segMain}>{shape.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldTitle}>Size</div>
                <div className={styles.segRow}>
                  {CURSOR_SIZES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      className={[styles.seg, settings.cursorSize === s.value ? styles.segActive : ""].join(" ")}
                      onClick={() => updateSettings({ cursorSize: s.value })}
                    >
                      <span className={styles.sizeDot} style={{ width: s.size, height: s.size }} />
                      <span className={styles.segMain}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "glass" && (
            <div className={styles.tabContent}>
              <p className={styles.tabDescription}>How frosted the cards and panels look.</p>
              <div className={styles.surfaceGrid}>
                {SURFACE_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    className={[styles.surfaceCard, settings.surfaceMode === mode.value ? styles.surfaceActive : ""].join(" ")}
                    onClick={() => updateSettings({ surfaceMode: mode.value })}
                    aria-pressed={settings.surfaceMode === mode.value}
                  >
                    <span
                      className={styles.surfacePreview}
                      style={{ ["--fill" as string]: mode.fill } as React.CSSProperties}
                      aria-hidden="true"
                    />
                    <span className={styles.surfaceName}>{mode.label}</span>
                    <span className={styles.surfaceHint}>{mode.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className={styles.panelFooter}>
          <button type="button" className={styles.resetBtn} onClick={resetToDefaults}>
            ↺ Reset
          </button>
          <span className={styles.footerHint}>Esc to close</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
