"use server";

import { headers } from "next/headers";
import { redis, ratelimit } from "@/lib/redis";
import { postExists } from "@/lib/posts";

// This is a public Server Action, so the slug is attacker-controlled. Reject
// anything that isn't a real post before touching Redis — otherwise arbitrary
// slugs could mint unbounded `views:*` keys (Upstash keyspace/cost abuse). The
// charset guard also blocks path-y input; postExists is a content-free lookup.
const SLUG_RE = /^[a-z0-9-]{1,80}$/;
function isKnownSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && postExists(slug);
}

/** Best-effort client IP from the common proxy headers, before a local fallback. */
function clientIp(h: Headers): string {
  const fwd = h.get("x-forwarded-for")?.split(",")[0].trim();
  return fwd || h.get("x-real-ip") || h.get("true-client-ip") || "127.0.0.1";
}

/**
 * Increment idempotently: once per IP+slug per 24h, rate-limited.
 * Returns the new count, or null when Redis isn't configured / errors.
 */
export async function incrementView(slug: string): Promise<number | null> {
  if (!redis || !isKnownSlug(slug)) return null;

  try {
    const ip = clientIp(await headers());

    if (ratelimit) {
      const { success } = await ratelimit.limit(`incr:${ip}`);
      if (!success) return (await redis.get<number>(`views:${slug}`)) ?? 0;
    }

    // SHA-256 hash the IP — never store a raw IP (KVKK/GDPR).
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${ip}:${slug}`),
    );
    const hash = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const isNew = await redis.set(`dedupe:${hash}`, "1", { nx: true, ex: 86400 });
    if (isNew) return await redis.incr(`views:${slug}`);

    return (await redis.get<number>(`views:${slug}`)) ?? 0;
  } catch {
    return null;
  }
}
