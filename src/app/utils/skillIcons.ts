/**
 * Maps the plain-text skill chip labels used in the About page's
 * "Technical skills" section (content.js -> technical.categories[].items)
 * to an icon (registered in `once-ui/icons.ts`) plus a color to render
 * it in — real brand colors for actual technologies, and a sensible
 * themed accent for concepts that don't have an official logo (NLP,
 * Automation, …), so every chip still gets a distinct, colorful badge.
 */
export interface SkillMeta {
  icon: string;
  color: string;
}

const FALLBACK_ACCENT = "#67E8F9";

const SKILL_META: Record<string, SkillMeta> = {
  python: { icon: "python", color: "#3776AB" },
  javascript: { icon: "javascript", color: "#F7DF1E" },
  sql: { icon: "database", color: "#C0392B" },
  "java (basic)": { icon: "openjdk", color: "#F89820" },
  java: { icon: "openjdk", color: "#F89820" },

  html: { icon: "html5", color: "#E34F26" },
  css: { icon: "css3", color: "#1572B6" },
  tailwindcss: { icon: "tailwindcss", color: "#38BDF8" },
  typescript: { icon: "typescript", color: "#3178C6" },
  react: { icon: "react", color: "#61DAFB" },
  "next.js": { icon: "nextjs", color: "#FFFFFF" },

  "scikit-learn": { icon: "scikitlearn", color: "#F7931E" },
  tensorflow: { icon: "tensorflow", color: "#FF6F00" },
  pandas: { icon: "pandas", color: "#E56AA8" },
  numpy: { icon: "numpy", color: "#4DABCF" },
  streamlit: { icon: "streamlit", color: "#FF4B4B" },

  claude: { icon: "anthropic", color: "#D97757" },
  n8n: { icon: "n8n", color: "#FF6D5A" },
  "flow wise": { icon: "code", color: "#A78BFA" },
  antigravity: { icon: "code", color: "#A78BFA" },

  "machine learning": { icon: "brain", color: "#8B5CF6" },
  nlp: { icon: "chat", color: "#10B981" },
  "computer vision": { icon: "eye", color: "#06B6D4" },
  pyspark: { icon: "apachespark", color: "#E25A1C" },
  "apache spark mllib": { icon: "apachespark", color: "#E25A1C" },
  hadoop: { icon: "apachehadoop", color: "#F6C915" },
  "big data etl": { icon: "stack", color: "#F59E0B" },

  git: { icon: "git", color: "#F05032" },
  github: { icon: "github", color: "#F5F5F5" },
  "jupyter notebook": { icon: "jupyter", color: "#F37626" },
  "google colab": { icon: "googlecolab", color: "#F9AB00" },
  "power bi": { icon: "chartBar", color: "#F2C811" },
  "microsoft office": { icon: "grid", color: "#EA580C" },

  english: { icon: "globe", color: "#38BDF8" },
  "tamil (native)": { icon: "globe", color: "#38BDF8" },
  tamil: { icon: "globe", color: "#38BDF8" },

  "once ui": { icon: "grid", color: "#A78BFA" },
  "framer motion": { icon: "framer", color: "#0055FF" },
  automation: { icon: "refresh", color: "#22D3EE" },
  "scheduling apis": { icon: "calendar", color: "#34D399" },
  tokenization: { icon: "code", color: "#A78BFA" },
  eda: { icon: "chartBar", color: "#F59E0B" },
  "rest apis": { icon: "globe", color: "#38BDF8" },
};

export function getSkillMeta(label: string): SkillMeta {
  const key = label.trim().toLowerCase();
  return SKILL_META[key] || { icon: "code", color: FALLBACK_ACCENT };
}
