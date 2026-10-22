import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  reactStrictMode: true,

  // Hide the dev-only floating "N" badge so it never sits on top of the Games button.
  devIndicators: false,

  // Allow the Next.js dev server (HMR) to be reached from these origins.
  // Prevents "Blocked cross-origin request" warnings/HMR failures when
  // accessing the dev server via 127.0.0.1, a LAN IP, etc.
  allowedDevOrigins: ["localhost", "127.0.0.1"],

  experimental: {
    optimizePackageImports: ["react-icons"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Required for Next.js 16 when webpack config is injected by plugins
  turbopack: {},
};

export default withMDX(nextConfig);