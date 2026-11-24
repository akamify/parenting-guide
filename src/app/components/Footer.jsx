import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const linkClass = "inline-flex min-h-11 items-center rounded-md text-sm text-[#455745] transition-colors hover:text-[#237344] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]";

export default function Footer({ reserveStickySpace = false }) {
  return (
    <footer className={`border-t border-[#103723]/12 bg-[#EDF2E5] text-[#103723] lg:pb-0 ${reserveStickySpace ? "pb-[calc(6rem+env(safe-area-inset-bottom,0px))]" : "pb-[env(safe-area-inset-bottom,0px)]"}`}>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:gap-12">
          <div className="max-w-sm">
            <Link href="/" aria-label="Parenting Guide home" className={`w-fit gap-3 ${linkClass}`}><Image src="/logo.png" alt="" width={44} height={44} className="size-11 object-contain" /><span className="text-lg font-bold tracking-tight text-[#103723]">Parenting Guide</span></Link>
            <p className="mt-3 text-sm leading-relaxed text-[#596258]">Practical guidance for calmer parenting and stronger family connections.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:gap-x-12">
            <nav aria-label="Explore"><p className="mb-2 text-xs font-bold text-[#103723]">Explore</p><ul><li><Link href="/#program" className={linkClass}>Workshop topics</Link></li><li><Link href="/#gallery" className={linkClass}>Community moments</Link></li><li><a href="https://wa.me/919065117353" target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-1`}>WhatsApp support<ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" /></a></li></ul></nav>
            <nav aria-label="Legal"><p className="mb-2 text-xs font-bold text-[#103723]">Information</p><ul><li><Link href="/privacy-policy" className={linkClass}>Privacy Policy</Link></li><li><Link href="/terms-of-service" className={linkClass}>Terms of Service</Link></li></ul></nav>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-2 border-t border-[#103723]/12 pt-5 text-xs leading-relaxed text-[#667060] sm:flex-row sm:items-center sm:justify-between"><p>&copy; 2026 Pravesh Parenting. All rights reserved.</p><p>Developed by <span className="font-semibold">Akamify</span></p></div>
      </div>
    </footer>
  );
}
