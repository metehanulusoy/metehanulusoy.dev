import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // run on everything except API, Next internals, metadata routes, and files with an extension
  matcher: "/((?!api|_next|_vercel|opengraph-image|sitemap|robots|icon|.*\\..*).*)",
};
