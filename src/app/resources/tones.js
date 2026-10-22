// Per-page colour tones for the Liquid Glass theme.
// Each page gets ONE main colour (cyan · emerald · blood-red) or a mix of two.
// `brand` / `accent` are once-ui colour scales; `tone` keys the custom glass,
// aurora and spotlight colours defined in src/styles/tones.scss.
export const TONES = {
  routes: {
    "/": "cyan",
    "/about": "emerald",
    "/project": "blood",
    "/work": "teal",
    "/gallery": "bloodcyan",
    "/contact": "cyan",
  },
  tones: {
    cyan: { tone: "cyan", brand: "cyan", accent: "emerald" },
    emerald: { tone: "emerald", brand: "emerald", accent: "cyan" },
    blood: { tone: "blood", brand: "red", accent: "magenta" },
    teal: { tone: "teal", brand: "aqua", accent: "cyan" },
    bloodcyan: { tone: "bloodcyan", brand: "red", accent: "cyan" },
  },
};

export function toneForPath(pathname) {
  const p = (pathname || "/").replace(/\/$/, "") || "/";
  for (const route of Object.keys(TONES.routes)) {
    if (route === "/" ? p === "/" : p === route || p.startsWith(route + "/")) {
      return TONES.tones[TONES.routes[route]];
    }
  }
  return TONES.tones.cyan;
}
