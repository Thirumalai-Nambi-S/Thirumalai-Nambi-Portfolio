"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

const W = 560;
const H = 340;
const GRAVITY = 0.42;
const JUMP_V = -7.2;
const BOT_R = 14;
const PIPE_W = 54;
const GAP = 118;
const PIPE_SPEED = 2.6;
const SPAWN_GAP_PX = 250;

const LABELS = ["ERROR 404", "ERROR 500", "BUG", "EXCEPTION", "NULL PTR", "TIMEOUT"];

interface Pipe {
  x: number;
  gapY: number;
  label: string;
  passed: boolean;
}

function makePipe(x: number): Pipe {
  const margin = 40;
  const gapY = margin + Math.random() * (H - GAP - margin * 2);
  return {
    x,
    gapY,
    label: LABELS[Math.floor(Math.random() * LABELS.length)],
    passed: false,
  };
}

export function FlappyDev() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    botY: H / 2,
    botV: 0,
    pipes: [] as Pipe[],
    score: 0,
    frame: 0,
  });
  const [phase, setPhase] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const rafRef = useRef<number | null>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const s = stateRef.current;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#1B1E30";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#23263C";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 28) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += 28) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    s.pipes.forEach((p) => {
      ctx.fillStyle = "#3A2530";
      ctx.strokeStyle = "#E24B4A";
      ctx.lineWidth = 1.5;
      ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
      ctx.strokeRect(p.x, 0, PIPE_W, p.gapY);
      ctx.fillRect(p.x, p.gapY + GAP, PIPE_W, H - (p.gapY + GAP));
      ctx.strokeRect(p.x, p.gapY + GAP, PIPE_W, H - (p.gapY + GAP));

      ctx.save();
      ctx.translate(p.x + PIPE_W / 2, p.gapY / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#F09595";
      ctx.font = "10px var(--font-code), monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.label, 0, 0);
      ctx.restore();
    });

    ctx.save();
    ctx.translate(90, s.botY);
    ctx.rotate(Math.max(-0.4, Math.min(0.9, s.botV / 10)));
    ctx.fillStyle = "#2A2E48";
    ctx.strokeStyle = "#FB923C";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, BOT_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#FB923C";
    ctx.beginPath();
    ctx.arc(4, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FB923C";
    ctx.fillRect(-3, 9, 6, 3);
    ctx.restore();
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    s.botV += GRAVITY;
    s.botY += s.botV;
    s.frame += 1;

    if (s.frame % Math.round(SPAWN_GAP_PX / PIPE_SPEED) === 0) {
      s.pipes.push(makePipe(W + 20));
    }

    s.pipes.forEach((p) => (p.x -= PIPE_SPEED));
    s.pipes = s.pipes.filter((p) => p.x > -PIPE_W - 5);

    let crashed = s.botY - BOT_R < 0 || s.botY + BOT_R > H;

    s.pipes.forEach((p) => {
      const botX = 90;
      const withinX = botX + BOT_R > p.x && botX - BOT_R < p.x + PIPE_W;
      if (withinX) {
        const hitsTop = s.botY - BOT_R < p.gapY;
        const hitsBottom = s.botY + BOT_R > p.gapY + GAP;
        if (hitsTop || hitsBottom) crashed = true;
      }
      if (!p.passed && p.x + PIPE_W < 90) {
        p.passed = true;
        s.score += 1;
      }
    });

    draw(ctx);
    setScore(s.score);

    if (crashed) {
      setPhase("gameover");
      setBest((b) => Math.max(b, s.score));
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  const startGame = () => {
    stateRef.current = { botY: H / 2, botV: 0, pipes: [], score: 0, frame: 0 };
    setScore(0);
    setPhase("playing");
  };

  const flap = useCallback(() => {
    if (phase === "playing") {
      stateRef.current.botV = JUMP_V;
    } else if (phase === "idle" || phase === "gameover") {
      startGame();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "playing") {
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, loop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && phase !== "playing") {
      const ctx = canvas.getContext("2d");
      if (ctx) draw(ctx);
    }
  }, [phase, draw]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flap]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Flappy Dev</h1>
          <p style={styles.subtitle}>Guide the bot through the exceptions. Click or press space.</p>
        </div>
      </div>

      <div style={styles.statBar}>
        <Stat label="score" value={String(score)} />
        <Stat label="best" value={String(best)} />
        <button type="button" style={styles.resetBtn} onClick={flap}>
          {phase === "idle" ? "Start" : phase === "gameover" ? "Retry" : "Flap"}
        </button>
      </div>

      <div style={styles.canvasWrap} onClick={flap}>
        {/*
          The canvas keeps a fixed 560x340 internal drawing resolution
          (all the physics/pipe-gap math above is tuned for exactly
          that), but its CSS display size scales to fit the container —
          the browser handles the visual scaling, so this stays sharp
          and responsive without touching any game logic.
        */}
        <canvas ref={canvasRef} width={W} height={H} style={styles.canvas} />
        {phase === "idle" && (
          <div style={styles.overlay}>
            <div style={styles.overlayTitle}>Ready to deploy</div>
            <div style={styles.overlaySub}>Click anywhere to launch the bot.</div>
          </div>
        )}
        {phase === "gameover" && (
          <div style={styles.overlay}>
            <div style={styles.overlayTitle}>Crashed</div>
            <div style={styles.overlaySub}>You survived {score} errors.</div>
            <div style={styles.overlayHint}>Click to try again</div>
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
  header: { marginBottom: "20px" },
  title: {
    fontFamily: "var(--font-primary)",
    fontWeight: 600,
    fontSize: "24px",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  subtitle: { margin: "4px 0 0", fontSize: "13px", color: "#8A8DAE" },
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
  canvasWrap: {
    position: "relative",
    width: "100%",
    maxWidth: `${W}px`,
    margin: "0 auto",
    cursor: "pointer",
  },
  canvas: {
    display: "block",
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    border: "1px solid #2A2E48",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    textAlign: "center",
    background: "rgba(23, 26, 43, 0.55)",
    borderRadius: "12px",
    pointerEvents: "none",
  },
  overlayTitle: { fontFamily: "var(--font-primary)", fontSize: "20px", fontWeight: 600, color: "#F3E7CE" },
  overlaySub: { fontSize: "13px", color: "#C7C9DE" },
  overlayHint: { fontSize: "11px", color: "#8A8DAE", marginTop: "6px", fontFamily: "var(--font-code)" },
};
