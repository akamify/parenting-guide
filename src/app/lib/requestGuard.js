import { createHash, randomUUID } from "node:crypto";

const local = globalThis.__parentingGuards ||= { rates: new Map(), locks: new Map() };
const redisUrl = () => process.env.UPSTASH_REDIS_REST_URL;
export function requestError(message, status = 400) { return Object.assign(new Error(message), { status }); }
export const digest = (value) => createHash("sha256").update(String(value)).digest("hex");

async function redis(command) {
  if (!redisUrl() || !process.env.UPSTASH_REDIS_REST_TOKEN) throw requestError("Shared request storage is not configured.", 503);
  const response = await fetch(redisUrl(), { method: "POST", headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(command), signal: AbortSignal.timeout(5000), cache: "no-store" });
  const data = await response.json();
  if (!response.ok || data.error) throw requestError("Request storage is temporarily unavailable.", 503);
  return data.result;
}

export async function readLimitedText(req) {
  if (Number(req.headers.get("content-length")) > 16_384) throw requestError("Request is too large.", 413);
  const reader = req.body?.getReader();
  if (!reader) throw requestError("Request body is required.");
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 16_384) { await reader.cancel(); throw requestError("Request is too large.", 413); }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function readJson(req) {
  if (!req.headers.get("content-type")?.includes("application/json")) throw requestError("Send a JSON request.", 415);
  const text = await readLimitedText(req);
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch { throw requestError("Invalid JSON request."); }
}

export function checkOrigin(req) {
  const origin = req.headers.get("origin");
  const allowed = new URL(process.env.NEXT_PUBLIC_SITE_URL || req.url).origin;
  if (req.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== allowed && origin !== new URL(req.url).origin)) throw requestError("Request origin is not allowed.", 403);
}

export async function rateLimit(req, action, limit = 5, windowSeconds = 900) {
  if ((process.env.REQUIRE_SHARED_STATE === "true" || process.env.VERCEL) && !redisUrl()) throw requestError("Registration is temporarily unavailable.", 503);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const key = `parenting:rate:${action}:${digest(ip)}`;
  if (redisUrl()) {
    const count = await redis(["EVAL", "local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end;return n", 1, key, windowSeconds]);
    if (Number(count) > limit) throw requestError("Too many attempts. Please wait 15 minutes and try again.", 429);
  } else {
    const now = Date.now();
    for (const [k,v] of local.rates) if (v.until <= now) local.rates.delete(k);
    if (local.rates.size >= 10000 && !local.rates.has(key)) throw requestError("Please try again later.", 429);
    const bucket = local.rates.get(key) || { count: 0, until: now + windowSeconds * 1000 };
    bucket.count++; local.rates.set(key, bucket);
    if (bucket.count > limit) throw requestError("Too many attempts. Please wait 15 minutes and try again.", 429);
  }
}

export async function withLock(key, action, ttlSeconds = 120) {
  if ((process.env.REQUIRE_SHARED_STATE === "true" || process.env.VERCEL) && !redisUrl()) throw requestError("Shared request storage is unavailable.", 503);
  const lockKey = `parenting:lock:${digest(key)}`;
  const token = randomUUID();
  if (redisUrl()) {
    if (await redis(["SET", lockKey, token, "NX", "EX", ttlSeconds]) !== "OK") throw requestError("This request is already being processed. Please wait a moment.", 409);
  } else {
    const now = Date.now();
    for (const [k,v] of local.locks) if (v.until <= now) local.locks.delete(k);
    if (local.locks.has(lockKey)) throw requestError("This request is already being processed. Please wait a moment.", 409);
    local.locks.set(lockKey, { token, until: now + ttlSeconds * 1000 });
  }
  try { return await action(); }
  finally {
    if (redisUrl()) {
      try { await redis(["EVAL", "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end", 1, lockKey, token]); } catch { /* TTL releases the lock if storage is unavailable. */ }
    } else if (local.locks.get(lockKey)?.token === token) local.locks.delete(lockKey);
  }
}
