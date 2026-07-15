import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bilder liegen lokal vorkomprimiert in /public – kein Loader nötig.
  images: { unoptimized: true },
  // Projektordner ist die Wurzel (streunende Lockfiles im Home ignorieren)
  outputFileTracingRoot: __dirname,
  // Schlanker Self-Hosting-Build: server.js + nur die nötigen node_modules
  output: "standalone",
};

export default nextConfig;
