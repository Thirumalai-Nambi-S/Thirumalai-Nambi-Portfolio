"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

type DifficultyKey = "easy" | "medium" | "hard";

const DIFFICULTIES: Record<DifficultyKey, { label: string; size: number; life: number }> = {
  easy: { label: "Easy", size: 64, life: 1600 },
  medium: { label: "Medium", size: 48, life: 1200 },
  hard: { label: "Hard", size: 34, life: 850 },
};

const TOTAL_TARGETS = 20;
// Design-reference aspect ratio for the arena — actual pixel size is
// measured at runtime (see `arenaSizeRef`) so target positions are
// always correct relative to however large the arena actually renders,
// rather than assuming a fixed 560x340px box that would overflow on
// narrow screens.
const AREA_RATIO = 560 / 340;
const FALLBACK_W = 560;
const FALLBACK_H = 340;

function rankFor(avgMs: number) {
  if (avgMs < 180) return { label: "Ludicrous", tag: "🚀" };
  if (avgMs < 260) return { label: "Fast coder", tag: "⚡" };
  if (avgMs < 360) return { label: "Sharp", tag: "🧠" };
  if (avgMs < 480) return { label: "Steady", tag: "🙂" };
  return { label: "Warming up", tag: "🐢" };
}

export function AimTrainer() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>("medium");
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [spawnedCount, setSpawnedCount] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactions, setReactions] = useState<number[]>([]);

  const arenaRef = useRef<HTMLDivElement>(null);
  const arenaSizeRef = useRef({ width: FALLBACK_W, height: FALLBACK_H });
  const spawnTimeRef = useRef(0);
  const expiryRef = useRef<number | null>(null);

  const cfg = DIFFICULTIES[difficulty];

  useEffect(() => {
    const node = arenaRef.current;
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        arenaSizeRef.current = { width: rect.width, height: rect.height };
      }
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const clearExpiry = () => {
    if (expiryRef.current) {
      window.clearTimeout(expiryRef.current);
      expiryRef.current = null;
    }
  };

  const randomPos = (size: number) => {
    const { width, height } = arenaSizeRef.current;
    const x = Math.random() * Math.max(width - size, 0);
    const y = Math.random() * Math.max(height - size, 0);
    return { x, y };
  };

  const spawnNext = useCallback(
    (countSoFar: number) => {
      if (countSoFar >= TOTAL_TARGETS) {
        setPhase("done");
        setTarget(null);
        return;
      }
      const pos = randomPos(cfg.size);
      setTarget(pos);
      spawnTimeRef.current = performance.now();
      clearExpiry();
      expiryRef.current = window.setTimeout(() => {
        setMisses((m) => m + 1);
        setSpawnedCount((c) => {
          const next = c + 1;
          spawnNext(next);
          return next;
        });
      }, cfg.life);
    },
    [cfg.size, cfg.life],
  );

  const startGame = () => {
    // Re-measure right before playing in case the layout shifted while idle.
    if (arenaRef.current) {
      const rect = arenaRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        arenaSizeRef.current = { width: rect.width, height: rect.height };
      }
    }
    setHits(0);
    setMisses(0);
    setReactions([]);
    setSpawnedCount(0);
    setPhase("playing");
    spawnNext(0);
  };

  const handleHit = () => {
    if (phase !== "playing") return;
    clearExpiry();
    const rt = performance.now() - spawnTimeRef.current;
    setReactions((r) => [...r, rt]);
    setHits((h) => h + 1);
    setSpawnedCount((c) => {
      const next = c + 1;
      spawnNext(next);
      return next;
    });
  };

  useEffect(() => () => clearExpiry(), []);

  const avgReaction =
    reactions.length > 0 ? Math.round(reactions.reduce((a, b) => a + b, 0) / reactions.length) : 0;
  const attempted = hits + misses;
  const accuracy = attempted > 0 ? Math.round((hits / attempted) * 100) : 0;
  const rank = rankFor(avgReaction || 999);
  const lastReaction = reactions.length ? Math.round(reactions[reactions.length - 1]) : null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Aim Trainer</h1>
          <p style={styles.subtitle}>Click the target before it fades. {TOTAL_TARGETS} rounds.</p>
        </div>
        <div style={styles.tabs}>
          {(Object.entries(DIFFICULTIES) as [DifficultyKey, (typeof DIFFICULTIES)[DifficultyKey]][]).map(
            ([key, d]) => (
              <button
                key={key}
                type="button"
                disabled={phase === "playing"}
                onClick={() => setDifficulty(key)}
                style={{
                  ...styles.tab,
                  ...(difficulty === key ? styles.tabActive : {}),
                  opacity: phase === "playing" ? 0.5 : 1,
                }}
              >
                {d.label}
              </button>
            ),
          )}
        </div>
      </div>

      <div style={styles.statBar}>
        <Stat label="reaction" value={lastReaction !== null ? `${lastReaction} ms` : "—"} />
        <Stat label="progress" value={`${spawnedCount}/${TOTAL_TARGETS}`} />
        <Stat label="accuracy" value={attempted > 0 ? `${accuracy}%` : "—"} />
        <button type="button" style={styles.resetBtn} onClick={startGame}>
          {phase === "idle" ? "Start" : "Restart"}
        </button>
      </div>

      <div
        ref={arenaRef}
        style={{ ...styles.arena, aspectRatio: String(AREA_RATIO) }}
        onClick={() => {
          if (phase === "playing" && target) setMisses((m) => m + 1);
        }}
      >
        {phase === "idle" && (
          <div style={styles.overlayText}>
            <div style={styles.overlayTitle}>Ready</div>
            <div style={styles.overlaySub}>Press start, then click each target fast.</div>
          </div>
        )}

        {phase === "playing" && target && (
          <button
            type="button" onClick={(e) => {
              e.stopPropagation();
              handleHit();
            }}
            style={{
              ...styles.target,
              width: cfg.size,
              height: cfg.size,
              left: target.x,
              top: target.y,
            }}
            aria-label="target"
          />
        )}

        {phase === "done" && (
          <div style={styles.overlayText}>
            <div style={styles.rankTag}>{rank.tag}</div>
            <div style={styles.overlayTitle}>{rank.label}</div>
            <div style={styles.resultsRow}>
              <Result label="avg reaction" value={`${avgReaction} ms`} />
              <Result label="accuracy" value={`${accuracy}%`} />
              <Result label="hits" value={`${hits}/${TOTAL_TARGETS}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.resultItem}>
      <div style={styles.resultValue}>{value}</div>
      <div style={styles.resultLabel}>{label}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "transparent",
    color: "#E4E5F1",
    borderRadius: "16px",
    padding: "24px 20px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    width: "100%",
    maxWidth: "600px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "14px",
    marginBottom: "20px",
  },
  title: {
    fontFamily: "var(--font-primary)",
    fontWeight: 600,
    fontSize: "24px",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  subtitle: { margin: "4px 0 0", fontSize: "13px", color: "#8A8DAE" },
  tabs: { display: "flex", gap: "6px", background: "transparent", border: "1px solid var(--neutral-alpha-weak)", padding: "4px", borderRadius: "10px" },
  tab: {
    border: "none",
    background: "transparent",
    color: "#8A8DAE",
    fontSize: "12.5px",
    padding: "7px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontFamily: "var(--font-code)",
  },
  tabActive: { background: "#A78BFA", color: "#180C33", fontWeight: 600 },
  statBar: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    padding: "12px 16px",
    background: "transparent",
    border: "1px solid var(--neutral-alpha-weak)",
    borderRadius: "12px",
    marginBottom: "18px",
  },
  stat: { display: "flex", flexDirection: "column", gap: "2px" },
  statLabel: { fontSize: "10.5px", color: "#696C8C", fontFamily: "var(--font-code)" },
  statValue: { fontSize: "15px", fontFamily: "var(--font-code)", color: "#E4E5F1" },
  resetBtn: {
    marginLeft: "auto",
    border: "1px solid #383C58",
    background: "transparent",
    color: "#E4E5F1",
    fontSize: "12.5px",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  arena: {
    position: "relative",
    width: "100%",
    background: "transparent",
    border: "1px solid var(--neutral-alpha-weak)",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "crosshair",
    margin: "0 auto",
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
  },
  target: {
    position: "absolute",
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 30%, #D8C6FF, #A78BFA 60%, #6D4FC4)",
    border: "2px solid #E6DCFF",
    cursor: "pointer",
    padding: 0,
  },
  overlayText: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    textAlign: "center",
    padding: "0 24px",
  },
  overlayTitle: { fontFamily: "var(--font-primary)", fontSize: "20px", fontWeight: 600 },
  overlaySub: { fontSize: "13px", color: "#8A8DAE" },
  rankTag: { fontSize: "30px" },
  resultsRow: { display: "flex", gap: "22px", marginTop: "14px", flexWrap: "wrap", justifyContent: "center" },
  resultItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  resultValue: { fontFamily: "var(--font-code)", fontSize: "16px", color: "#E6DCFF" },
  resultLabel: { fontFamily: "var(--font-code)", fontSize: "10.5px", color: "#696C8C" },
};
