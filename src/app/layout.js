import Script from "next/script";
import ConditionalFooter from "./components/ConditionalFooter";
import { siteUrl } from "./lib/site";
import "./globals.css";

const description = "Join Parenting Guide's free live Sunday workshop at 11 AM IST. Explore practical ways to understand your child, build connection and create healthier routines.";
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "26021697834109599";
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#237344" };
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Free Mindful Parenting Workshop | Parenting Guide", template: "%s | Parenting Guide" },
  description,
  applicationName: "Parenting Guide",
  authors: [{ name: "Parenting Guide" }],
  openGraph: { title: "Free Mindful Parenting Workshop", description, siteName: "Parenting Guide", locale: "en_IN", type: "website", images: [{ url: "/logo.png", width: 832, height: 832, alt: "Parenting Guide" }] },
  twitter: { card: "summary", title: "Free Mindful Parenting Workshop", description, images: ["/logo.png"] },
  icons: { icon: "/favicon.svg", apple: "/logo.png" },
  robots: { index: true, follow: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }) {
  const schema = { "@context": "https://schema.org", "@type": "Organization", name: "Parenting Guide", url: siteUrl, logo: `${siteUrl}/logo.png` };
  return (
    <html lang="en-IN">
      <body>
        <a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] rounded-xl bg-[#237344] px-4 py-3 text-white focus:not-sr-only">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        {children}
        <ConditionalFooter />
        {/^\d+$/.test(pixelId || "") && <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}</Script>}
      </body>
    </html>
  );
}
