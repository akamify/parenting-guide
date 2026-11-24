import { siteUrl } from "./lib/site";
export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you/", "/courses/"] }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
