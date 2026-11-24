export function getSiteUrl() {
  let raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.QSTASH_TARGET_URL || "https://parentingguide.in";
  raw = raw.trim().replace(/^['"]|['"]$/g, "");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid public site URL");
  return url.origin;
}

export const siteUrl = getSiteUrl();
