const path = require("path");

// Resolved from this config file's own location (not process.cwd()).
// A plain relative string here only works when the dev/build command is
// launched with this exact folder as the working directory — if the
// project is nested, symlinked, or run from a different cwd, the
// relative path silently points at the wrong place and postcss throws
// an ENOENT trying to read it. Anchoring to __dirname makes this work
// no matter where `next dev`/`next build` is invoked from.
module.exports = {
  plugins: [
    [
      "@csstools/postcss-global-data",
      {
        files: [path.join(__dirname, "src/once-ui/styles/breakpoints.scss")],
      },
    ],
    "postcss-custom-media",
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
  ],
};
