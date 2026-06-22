import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Import only the icons/animations actually used, guarding against an
    // accidental barrel import pulling the whole library into a client chunk.
    optimizePackageImports: ["lucide-react", "motion/react"],
  },
  // Behaviour-preserving response hardening (no Cache-Control here — the feed
  // routes set their own; no CSP, which could break inline styles/animations).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
