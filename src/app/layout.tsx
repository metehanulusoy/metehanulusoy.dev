import type { ReactNode } from "react";

// next-intl owns <html>/<body> in [locale]/layout.tsx (it needs the request
// locale). This root layout is a pass-through so a root not-found.tsx can exist
// for non-localized / unmatched URLs and render its own branded shell.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
