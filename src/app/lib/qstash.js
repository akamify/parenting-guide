// src/app/lib/qstash.js
import { Receiver } from "@upstash/qstash";

const QSTASH_BASE = process.env.QSTASH_BASE_URL || "https://qstash-us-east-1.upstash.io";

function requireEnv(name) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}

export function getQstashTargetUrl(reqUrl, headers) {
  if (process.env.QSTASH_TARGET_URL) return normalizeBaseUrl(process.env.QSTASH_TARGET_URL);
  if (process.env.NEXT_PUBLIC_SITE_URL) return normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.NODE_ENV === "production") throw new Error("QSTASH_TARGET_URL or NEXT_PUBLIC_SITE_URL is required");
  if (reqUrl) return new URL(reqUrl).origin;
  return "http://localhost:3000";
}

function normalizeBaseUrl(raw) {
  if (!raw) return raw;
  let value = String(raw).trim();
  // strip wrapping quotes if user saved value like "https://example.com"
  value = value.replace(/^['"]|['"]$/g, "");
  if (!/^https?:\/\//i.test(value)) {
    const isLocal = value.startsWith("localhost") || value.startsWith("127.0.0.1");
    value = `${isLocal ? "http" : "https"}://${value}`;
  }
  return value.replace(/\/$/, "");
}

export async function publishScheduled({ url, body, notBeforeEpochSeconds }) {
  requireEnv("QSTASH_TOKEN");

  const publishUrl = `${QSTASH_BASE}/v2/publish/${url}`;

  const res = await fetch(publishUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
      "Content-Type": "application/json",
      "Upstash-Deduplication-Id": `${body.leadId}:${body.type}:${notBeforeEpochSeconds}`,
      "Upstash-Retries": "3",
      ...(notBeforeEpochSeconds > toEpochSeconds(Date.now()) && {
        "Upstash-Not-Before": String(notBeforeEpochSeconds),
      }),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`QStash publish failed (${res.status}): ${text}`);
  }

  return text;
}

export async function verifyQstashRequest({ body, signature, reqUrl }) {
  requireEnv("QSTASH_CURRENT_SIGNING_KEY");
  requireEnv("QSTASH_NEXT_SIGNING_KEY");

  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
  });

  const requestedPath = new URL(reqUrl).pathname;
  const base = getQstashTargetUrl(reqUrl);
  // Older queued jobs used the non-trailing-slash URL before Next.js redirected it.
  for (const path of new Set([requestedPath, "/api/qstash", "/api/qstash/"])) {
    try { if (await receiver.verify({ body, signature, url: `${base}${path}` })) return true; }
    catch { /* Try the other supported callback URL spelling. */ }
  }
  return false;
}

export function toEpochSeconds(timestamp) {
  return Math.floor(new Date(timestamp).getTime() / 1000);
}
