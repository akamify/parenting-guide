import { siteUrl } from "./lib/site";
export default function sitemap() {
  return ["/", "/form/", "/privacy-policy/", "/terms-of-service/"].map(path => ({ url: `${siteUrl}${path}`, changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : 0.5 }));
}
