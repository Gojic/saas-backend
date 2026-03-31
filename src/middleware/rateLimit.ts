import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import crypto from "crypto";
import { redis, ensureRedis } from "../infra/redis";

function hashEmail(email: string) {
  return crypto.createHash("sha256").update(email).digest("hex").slice(0, 16);
}

function makeStore(prefix: string) {
  return new RedisStore({
    prefix,

    sendCommand: async (...args: string[]) => {
      await ensureRedis();
      return redis.sendCommand(args);
    },
  });
}

// 1) IP limiter (bez custom keyGenerator => nema IPv6 warninga)
export const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore("rl:login:ip:"),
  message: {
    success: false,
    code: "RATE_LIMITED",
    message: "Too many attempts. Try later.",
  },
});

// 2) Identity limiter (email-based)
export const loginIdentityLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore("rl:login:email:"),
  keyGenerator: (req) => {
    const raw = (req.body?.email ?? "").toString().trim().toLowerCase();

    const ipKey = ipKeyGenerator(req.ip ?? "");

    return raw ? `email:${hashEmail(raw)}` : `missing:${ipKey}`;
  },
  message: {
    success: false,
    code: "TOO_MANY_ATTEMPTS",
    message: "Too many attempts. Try later.",
  },
});
