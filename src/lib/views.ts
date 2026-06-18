"use server";

import { headers } from "next/headers";
import { redis, ratelimit } from "@/lib/redis";

/** Read the view count for a slug. Returns null when Redis isn't configured or errors. */
export async function getViews(slug: string): Promise<number | null> {
  if (!redis) return null;
  try {
    return (await redis.get<number>(`views:${slug}`)) ?? 0;
  } catch {
    return null;
  }
}

/**
 * Increment idempotently: once per IP+slug per 24h, rate-limited.
 * Returns the new count, or null when Redis isn't configured / errors.
 */
export async function incrementView(slug: string): Promise<number | null> {
  if (!redis) return null;

  try {
    const h = await headers();
    const ip = (h.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0].trim();

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
