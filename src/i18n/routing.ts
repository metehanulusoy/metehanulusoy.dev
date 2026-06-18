import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  // default locale has no prefix (/), Turkish lives at /tr
  localePrefix: "as-needed",
});
