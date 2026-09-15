"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const TECH_PAIRS = [
  { id: "python", term: "Python", emoji: "🐍" },
  { id: "tensorflow", term: "TensorFlow", emoji: "🧠" },
  { id: "postgresql", term: "PostgreSQL", emoji: "🐘" },
  { id: "docker", term: "Docker", emoji: "🐳" },
  { id: "github", term: "GitHub", emoji: "🐙" },
  { id: "kubernetes", term: "Kubernetes", emoji: "☸️" },
  { id: "react", term: "React", emoji: "⚛️" },
  { id: "linux", term: "Linux", emoji: "🐧" },
  { id: "rust", term: "Rust", emoji: "🦀" },
  { id: "mongodb", term: "MongoDB", emoji: "🍃" },
];

type DifficultyKey = "easy" | "medium" | "hard";

const DIFFICULTIES: Record<DifficultyKey, { label: string; pairs: number; cols: number }> = {
  easy: { label: "Easy", pairs: 6, cols: 4 },
  medium: { label: "Medium", pairs: 8, cols: 4 },
  hard: { label: "Hard", pairs: 10, cols: 5 },
};

interface CardData {
  uid: string;
  pairId: string;
  face: string;
  kind: "term" | "emoji";
}

interface BestScore {
  moves: number;
  time: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(difficultyKey: DifficultyKey): CardData[] {
  const { pairs } = DIFFICULTIES[difficultyKey];
  const chosen = shuffle(TECH_PAIRS).slice(0, pairs);
  const cards: CardData[] = [];
  chosen.forEach((pair) => {
    cards.push({ uid: `${pair.id}-term`, pairId: pair.id, face: pair.term, kind: "term" });
    cards.push({ uid: `${pair.id}-emoji`, pairId: pair.id, face: pair.emoji, kind: "emoji" });
  });
  return shuffle(cards);
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function AIMemoryMatch() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>("easy");
  // Initialized empty (not via buildDeck()) so the server-rendered HTML
  // and the client's first render are identical — buildDeck() shuffles
  // with Math.random(), so calling it directly in useState's
  // initializer produced a *different* shuffle on the server vs. the
  // client, a classic hydration mismatch. When React detects that kind
  // of mismatch it can fail to attach event listeners to the affected
  // subtree at all, which is what made every card silently unclickable.
  // The real deck is built in the effect below instead, which only
  // ever runs on the client, after hydration.
  const [deck, setDeck] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<CardData[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bests, setBests] = useState<Record<DifficultyKey, BestScore | null>>({
    easy: null,
    medium: null,
    hard: null,
  });

  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setElapsed(Date.now() - (startRef.current ?? Date.now()));
      }, 250);
    }
    return () => window.clearInterval(intervalRef.current);
  }, [running]);

  // Build the real, randomly-shuffled deck once the component has
  // mounted on the client — deliberately not during the initial
  // render, to avoid the server/client hydration mismatch described
  // above.
  useEffect(() => {
    setDeck(buildDeck("easy"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newGame = useCallback((diffKey: DifficultyKey) => {
    window.clearInterval(intervalRef.current);
    setDeck(buildDeck(diffKey));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setElapsed(0);
    setRunning(false);
    setWon(false);
    setBusy(false);
    startRef.current = null;
  }, []);

  const handleDifficultyChange = (key: DifficultyKey) => {
    setDifficulty(key);
    newGame(key);
  };

  const handleFlip = (card: CardData) => {
    if (busy) return;
    if (flipped.some((c) => c.uid === card.uid)) return;
    if (matched.includes(card.pairId)) return;

    if (!running) {
      setRunning(true);
      startRef.current = Date.now();
    }

    const nextFlipped = [...flipped, card];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);
      const [a, b] = nextFlipped;
      if (a.pairId === b.pairId) {
        window.setTimeout(() => {
          setMatched((m) => [...m, a.pairId]);
          setFlipped([]);
          setBusy(false);
        }, 450);
      } else {
        window.setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    const totalPairs = DIFFICULTIES[difficulty].pairs;
    if (matched.length === totalPairs && totalPairs > 0 && !won) {
      setWon(true);
      setRunning(false);
      window.clearInterval(intervalRef.current);
      setBests((prev) => {
        const current = prev[difficulty];
        const finalTime = Date.now() - (startRef.current ?? Date.now());
        if (!current || moves < current.moves || (moves === current.moves && finalTime < current.time)) {
          return { ...prev, [difficulty]: { moves, time: finalTime } };
        }
        return prev;
      });
    }
  }, [matched, difficulty, won, moves]);

  const cols = DIFFICULTIES[difficulty].cols;
  const best = bests[difficulty];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>AI Memory Match</h1>
          <p style={styles.subtitle}>Pair the stack with its symbol.</p>
        </div>
        <div style={styles.tabs}>
          {(Object.entries(DIFFICULTIES) as [DifficultyKey, (typeof DIFFICULTIES)[DifficultyKey]][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleDifficultyChange(key)}
                style={{
                  ...styles.tab,
                  ...(difficulty === key ? styles.tabActive : {}),
                }}
              >
                {cfg.label}
              </button>
            ),
          )}
        </div>
      </div>

      <div style={styles.statBar}>
        <Stat label="time" value={formatTime(elapsed)} />
        <Stat label="moves" value={String(moves)} />
        <Stat label="best" value={best ? `${best.moves} mv · ${formatTime(best.time)}` : "—"} />
        <button type="button" style={styles.resetBtn} onClick={() => newGame(difficulty)}>
          New game
        </button>
      </div>

      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {deck.map((card) => {
          const isFlipped = flipped.some((c) => c.uid === card.uid) || matched.includes(card.pairId);
          const isMatched = matched.includes(card.pairId);
          return (
            <div key={card.uid} style={styles.cardOuter} onClick={() => handleFlip(card)}>
              <div
                style={{
                  ...styles.cardInner,
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div style={styles.cardFaceBack}>
                  <span style={styles.cardMark}>&lt;/&gt;</span>
                </div>
                <div
                  style={{
                    ...styles.cardFaceFront,
                    ...(isMatched ? styles.cardFaceFrontMatched : {}),
                    fontFamily: card.kind === "term" ? "var(--font-code)" : "inherit",
                    fontSize: card.kind === "term" ? "12px" : "26px",
                  }}
                >
                  {card.face}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {won && (
        <div style={styles.winBanner}>
          <div>
            <div style={styles.winTitle}>Solved</div>
            <div style={styles.winMeta}>
              {moves} moves · {formatTime(elapsed)}
              {best && best.moves === moves && best.time <= elapsed ? " · new best" : ""}
            </div>
          </div>
          <button type="button" style={styles.resetBtn} onClick={() => newGame(difficulty)}>
            Play again
          </button>
        </div>
      )}
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
  subtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#8A8DAE",
  },
  tabs: {
    display: "flex",
    gap: "6px",
    background: "transparent",
    border: "1px solid var(--neutral-alpha-weak)",
    padding: "4px",
    borderRadius: "10px",
  },
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
  tabActive: {
    background: "#22D3EE",
    color: "#0B1220",
    fontWeight: 600,
  },
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
  statLabel: {
    fontSize: "10.5px",
    color: "#696C8C",
    fontFamily: "var(--font-code)",
  },
  statValue: {
    fontSize: "15px",
    fontFamily: "var(--font-code)",
    color: "#E4E5F1",
  },
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
  grid: {
    display: "grid",
    gap: "8px",
  },
  cardOuter: {
    aspectRatio: "3 / 4",
    perspective: "800px",
    cursor: "pointer",
  },
  cardInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.3, 1)",
    transformStyle: "preserve-3d",
  },
  cardFaceBack: {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    background: "#242840",
    border: "1px solid #34385A",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardMark: {
    color: "#4A4E74",
    fontFamily: "var(--font-code)",
    fontSize: "12px",
  },
  cardFaceFront: {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
    background: "#2A2E48",
    border: "1px solid #22D3EE",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "6px",
    color: "#CFF4FC",
  },
  cardFaceFrontMatched: {
    background: "#1B3B34",
    border: "1px solid #7FB77E",
    color: "#CDEAC7",
  },
  winBanner: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    background: "#1B3B34",
    border: "1px solid #7FB77E",
    borderRadius: "12px",
    padding: "14px 18px",
  },
  winTitle: {
    fontFamily: "var(--font-primary)",
    fontSize: "16px",
    fontWeight: 600,
    color: "#CDEAC7",
  },
  winMeta: {
    fontSize: "12px",
    color: "#9CC79A",
    fontFamily: "var(--font-code)",
    marginTop: "2px",
  },
};
