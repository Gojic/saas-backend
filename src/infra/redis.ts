import { createClient } from "redis";

export const redis = createClient({ url: process.env.REDIS_URL });

redis.on("error", (e) => console.error("Redis error", e));

export async function ensureRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
