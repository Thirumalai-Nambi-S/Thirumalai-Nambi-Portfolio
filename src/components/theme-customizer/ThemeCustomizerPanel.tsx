"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CursorShape,
  CursorSize,
  NeutralColor,
  SchemeColor,
  SurfaceMode,
  THEME_PRESETS,
  useThemeCustomizer,
} from "@/contexts/ThemeCustomizerContext";
import styles from "./ThemeCustomizer.module.scss";

const SCHEME_SWATCHES: { value: SchemeColor; hex: string; label: string }[] = [
  { value: "blue", hex: "#3B82F6", label: "Blue" },
  { value: "indigo", hex: "#6366F1", label: "Indigo" },
  { value: "violet", hex: "#8B5CF6", label: "Violet" },
  { value: "magenta", hex: "#D946EF", label: "Magenta" },
  { value: "pink", hex: "#EC4899", label: "Pink" },
  { value: "red", hex: "#EF4444", label: "Red" },
  { value: "orange", hex: "#F97316", label: "Orange" },
  { value: "yellow", hex: "#EAB308", label: "Yellow" },
  { value: "moss", hex: "#84A98C", label: "Moss" },
  { value: "green", hex: "#22C55E", label: "Green" },
  { value: "emerald", hex: "#10B981", label: "Emerald" },
  { value: "aqua", hex: "#06B6D4", label: "Aqua" },
  { value: "cyan", hex: "#22D3EE", label: "Cyan" },
];

const NEUTRAL_SWATCHES: { value: NeutralColor; hex: string; label: string }[] = [
  { value: "sand", hex: "#A8A29E", label: "Sand" },
  { value: "gray", hex: "#71717A", label: "Gray" },
  { value: "slate", hex: "#64748B", label: "Slate" },
];

const CURSOR_COLOR_PRESETS = [
  { hex: "#22D3EE", label: "Cyan" },
  { hex: "#60A5FA", label: "Blue" },
  { hex: "#A78BFA", label: "Violet" },
  { hex: "#F472B6", label: "Pink" },
  { hex: "#FB7185", label: "Rose" },
  { hex: "#FB923C", label: "Orange" },
  { hex: "#FDE047", label: "Yellow" },
  { hex: "#34D399", label: "Emerald" },
];

const CURSOR_SHAPES: { value: CursorShape; label: string; icon: string }[] = [
  { value: "circle", label: "Circle", icon: "○" },
  { value: "square", label: "Square", icon: "□" },
  { value: "diamond", label: "Diamond", icon: "◇" },
  { value: "ring", label: "Ring", icon: "◎" },
];

const CURSOR_SIZES: { value: CursorSize; label: string; size: number }[] = [
  { value: "small", label: "S", size: 8 },
  { value: "medium", label: "M", size: 12 },
  { value: "large", label: "L", size: 16 },
];

const SURFACE_MODES: { value: SurfaceMode; label: string; icon: string; hint: string }[] = [
  { value: "opaque", label: "Opaque", icon: "◼", hint: "Solid" },
  { value: "translucent", label: "Frosted", icon: "◫", hint: "Glass" },
  { value: "transparent", label: "Clear", icon: "◻", hint: "Blend" },
];

export function ThemeCustomizerPanel() {
  const { settings, updateSettings, applyPreset, resetToDefaults, isOpen, closeCustomizer } =
    useThemeCustomizer();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "cursor" | "colors" | "surface">("themes");

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

  const tabs = [
    { id: "themes" as const, label: "Themes", emoji: "🎨" },
    { id: "cursor" as const, label: "Cursor", emoji: "✦" },
    { id: "colors" as const, label: "Colors", emoji: "🌈" },
    { id: "surface" as const, label: "Surface", emoji: "◈" },
  ];

  return createPortal(
    <div className={styles.backdrop} onClick={closeCustomizer} role="dialog" aria-modal="true">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.panelHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>🎨</div>
            <div>
              <div className={styles.headerTitle}>Theme Studio</div>
              <div className={styles.headerSub}>Customize your experience</div>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={closeCustomizer} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Tab Bar ── */}
        <div className={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={[styles.tab, activeTab === tab.id ? styles.tabActive : ""].join(" ")}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabEmoji}>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className={styles.panelBody}>

          {/* ────── THEMES TAB ────── */}
          {activeTab === "themes" && (
            <div className={styles.tabContent}>
              <p className={styles.tabDescription}>Choose a built-in color palette for your portfolio.</p>
              <div className={styles.presetGrid}>
                {Object.entries(THEME_PRESETS).map(([id, preset]) => {
                  const a = SCHEME_SWATCHES.find((s) => s.value === preset.brand)?.hex ?? "#22d3ee";
                  const b = SCHEME_SWATCHES.find((s) => s.value === preset.accent)?.hex ?? "#a78bfa";
                  const isActive = settings.activePreset === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={[styles.presetCard, isActive ? styles.presetActive : ""].join(" ")}
                      onClick={() => applyPreset(id)}
                      style={{ ["--pa" as any]: a, ["--pb" as any]: b }}
                    >
                      <div className={styles.presetGradBar} />
                      <div className={styles.presetInfo}>
                        <span className={styles.presetName}>{preset.label}</span>
                        {isActive && <span className={styles.presetBadge}>Active</span>}
                      </div>
                      <span className={styles.presetDesc}>{preset.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ────── CURSOR TAB ────── */}
          {activeTab === "cursor" && (
            <div className={styles.tabContent}>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldIcon}>🎨</span>
                  <span className={styles.fieldTitle}>Trail Color</span>
                </div>
                <div className={styles.colorGrid}>
                  {CURSOR_COLOR_PRESETS.map(({ hex, label }) => (
                    <button
                      key={hex}
                      type="button"
                      title={label}
                      className={[
                        styles.colorDot,
                        settings.cursorColor.toLowerCase() === hex.toLowerCase() ? styles.colorDotActive : "",
                      ].join(" ")}
                      style={{ background: hex, ["--glow" as any]: hex }}
                      onClick={() => updateSettings({ cursorColor: hex })}
                    />
                  ))}
                  <label className={styles.colorPicker} title="Custom color">
                    <span>+</span>
                    <input
                      type="color"
                      value={settings.cursorColor}
                      onChange={(e) => updateSettings({ cursorColor: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldIcon}>◇</span>
                  <span className={styles.fieldTitle}>Shape</span>
                </div>
                <div className={styles.chipRow}>
                  {CURSOR_SHAPES.map((shape) => (
                    <button
                      key={shape.value}
                      type="button"
                      className={[styles.chip, settings.cursorShape === shape.value ? styles.chipActive : ""].join(" ")}
                      onClick={() => updateSettings({ cursorShape: shape.value })}
                    >
                      <span className={styles.chipIcon}>{shape.icon}</span>
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldIcon}>⊙</span>
                  <span className={styles.fieldTitle}>Size</span>
                </div>
                <div className={styles.sizeRow}>
                  {CURSOR_SIZES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      className={[styles.sizeBtn, settings.cursorSize === s.value ? styles.sizeBtnActive : ""].join(" ")}
                      onClick={() => updateSettings({ cursorSize: s.value })}
                    >
                      <span className={styles.sizeDot} style={{ width: s.size, height: s.size }} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────── COLORS TAB ────── */}
          {activeTab === "colors" && (
            <div className={styles.tabContent}>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldIcon}>★</span>
                  <span className={styles.fieldTitle}>Brand Color</span>
                </div>
                <div className={styles.colorGrid}>
                  {SCHEME_SWATCHES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      title={s.label}
                      className={[styles.colorDot, settings.brand === s.value ? styles.colorDotActive : ""].join(" ")}
                      style={{ background: s.hex, ["--glow" as any]: s.hex }}
                      onClick={() => updateSettings({ brand: s.value })}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldIcon}>◈</span>
                  <span className={styles.fieldTitle}>Accent Color</span>
                </div>
                <div className={styles.colorGrid}>
                  {SCHEME_SWATCHES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      title={s.label}
                      className={[styles.colorDot, settings.accent === s.value ? styles.colorDotActive : ""].join(" ")}
                      style={{ background: s.hex, ["--glow" as any]: s.hex }}
                      onClick={() => updateSettings({ accent: s.value })}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldIcon}>○</span>
                  <span className={styles.fieldTitle}>Neutral Tone</span>
                </div>
                <div className={styles.neutralRow}>
                  {NEUTRAL_SWATCHES.map((n) => (
                    <button
                      key={n.value}
                      type="button"
                      className={[styles.neutralCard, settings.neutral === n.value ? styles.neutralActive : ""].join(" ")}
                      onClick={() => updateSettings({ neutral: n.value })}
                    >
                      <span className={styles.neutralDot} style={{ background: n.hex }} />
                      <span>{n.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────── SURFACE TAB ────── */}
          {activeTab === "surface" && (
            <div className={styles.tabContent}>
              <p className={styles.tabDescription}>Control how cards and panels appear across the site.</p>
              <div className={styles.surfaceGrid}>
                {SURFACE_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    className={[styles.surfaceCard, settings.surfaceMode === mode.value ? styles.surfaceActive : ""].join(" ")}
                    onClick={() => updateSettings({ surfaceMode: mode.value })}
                  >
                    <span className={styles.surfaceIcon}>{mode.icon}</span>
                    <span className={styles.surfaceName}>{mode.label}</span>
                    <span className={styles.surfaceHint}>{mode.hint}</span>
                    {settings.surfaceMode === mode.value && (
                      <span className={styles.surfaceCheck}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className={styles.panelFooter}>
          <button type="button" className={styles.resetBtn} onClick={resetToDefaults}>
            ↺ Reset defaults
          </button>
          <span className={styles.footerHint}>Press Esc to close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
