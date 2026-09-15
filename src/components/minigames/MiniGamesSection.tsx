"use client";

import { useState } from "react";
import { Column, Heading, Text } from "@/once-ui/components";
import { Panel } from "@/components/Panel";
import { AIMemoryMatch } from "./AIMemoryMatch";
import { AimTrainer } from "./AimTrainer";
import { FlappyDev } from "./FlappyDev";
import styles from "./minigames.module.scss";

type GameKey = "memory" | "aim" | "flappy";

const GAMES: {
  value: GameKey;
  label: string;
  description: string;
  icon: string;
  accent: string;
}[] = [
  {
    value: "memory",
    label: "AI Memory Match",
    description: "Focus & recall",
    icon: "🧠",
    accent: "#22D3EE",
  },
  {
    value: "aim",
    label: "Aim Trainer",
    description: "Reflex & precision",
    icon: "🎯",
    accent: "#A78BFA",
  },
  {
    value: "flappy",
    label: "Flappy Dev",
    description: "Timing & rhythm",
    icon: "🐦",
    accent: "#FB923C",
  },
];

/**
 * MiniGamesSection
 * ----------------
 * A small tabbed arcade on the home page — pick a game, it renders
 * inside a mac-window-styled Panel to match the rest of the site's
 * visual language. Each game is a self-contained React component
 * (see AIMemoryMatch/AimTrainer/FlappyDev) with its own internal state,
 * so switching tabs just mounts/unmounts a fresh instance.
 */
export function MiniGamesSection() {
  const [active, setActive] = useState<GameKey>("memory");
  const activeGame = GAMES.find((g) => g.value === active)!;

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.separator}>
        <span className={styles.separatorLine} />
        <span className={styles.separatorLabel}>🎮 Mini Games</span>
        <span className={styles.separatorLine} />
      </div>

      <Column fillWidth gap="20" horizontal="center" align="center">
        <Column gap="8" horizontal="center" align="center" style={{ maxWidth: "620px" }}>
          <Heading as="h2" variant="heading-strong-l" align="center">
            Take a break — play while you're here
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak" align="center">
            A few quick browser games I built for fun. Pick one below.
          </Text>
        </Column>

        <div className={styles.tabRow}>
          {GAMES.map((game) => (
            <button
              type="button"
              key={game.value}
              className={[styles.tab, active === game.value ? styles.tabActive : ""].join(" ")}
              style={{ ["--tab-accent" as any]: game.accent }}
              onClick={() => setActive(game.value)}
            >
              <span className={styles.tabIcon}>{game.icon}</span>
              <span className={styles.tabText}>
                <span className={styles.tabLabel}>{game.label}</span>
                <span className={styles.tabDescription}>{game.description}</span>
              </span>
            </button>
          ))}
        </div>

        <Panel
          key={activeGame.value}
          accent="violet"
          title={`${activeGame.icon} ${activeGame.label}`}
          noPadding
          className={styles.gameFrame}
        >
          <div className={styles.gameBody}>
            {active === "memory" && <AIMemoryMatch />}
            {active === "aim" && <AimTrainer />}
            {active === "flappy" && <FlappyDev />}
          </div>
        </Panel>
      </Column>
    </div>
  );
}
