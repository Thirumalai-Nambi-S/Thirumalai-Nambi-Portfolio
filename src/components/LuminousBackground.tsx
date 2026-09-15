import styles from "./LuminousBackground.module.scss";

/**
 * Deep navy night-sky backdrop with a whisper of film grain and a soft
 * vignette. This is intentionally undecorated — it's the sky the
 * Starfield component's stars sit against. Purely decorative, fixed
 * behind all page content.
 */
export default function LuminousBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <span className={styles.grain} />
      <span className={styles.vignette} />
    </div>
  );
}
