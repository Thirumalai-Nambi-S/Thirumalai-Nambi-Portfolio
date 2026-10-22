import styles from "./LuminousBackground.module.scss";

/**
 * Plain near-black backdrop. The cursor spotlight (tinted by the current
 * page tone) is the main light source; this just provides the dark canvas
 * and a soft vignette. Purely decorative, fixed behind all page content.
 */
export default function LuminousBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <span className={styles.vignette} />
    </div>
  );
}
