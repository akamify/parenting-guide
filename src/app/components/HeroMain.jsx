import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarCheck2,
  Clock3,
  Users,
  HeartHandshake,
  Smile,
} from "lucide-react";
import WhatsAppContactButton, { WhatsAppIcon } from "./WhatsAppContactButton";

const registerButton = "inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#237344] px-5 py-4 text-base font-bold text-white shadow-[0_4px_12px_rgba(35,115,68,0.12)] transition-colors hover:bg-[#195934] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]";

export default function HeroMain() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="bg-[#FDFBF7] text-[#103723]">
      <header className="border-b border-[#103723]/8 bg-white">
        <div className="mx-auto flex min-h-18 max-w-[1248px] items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:min-h-20 lg:gap-5">
          <Link href="/" aria-label="Parenting Guide home" className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]">
            <Image src="/logo.png" alt="" width={52} height={52} className="size-11 shrink-0 object-contain sm:size-13" />
            <span className="text-base font-bold tracking-tight sm:text-xl lg:text-xl xl:text-2xl">Parenting Guide</span>
          </Link>
          <nav aria-label="Workshop navigation" className="hidden items-center gap-6 text-sm font-medium text-[#455745] lg:flex">
            <Link href="/#hero" className="inline-flex min-h-11 items-center rounded-md hover:text-[#237344] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]">Workshop</Link>
            <Link href="/#program" className="inline-flex min-h-11 items-center rounded-md hover:text-[#237344] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]">What you will learn</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <a href="https://wa.me/919065117353" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp support" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl text-[#237344] transition-colors hover:bg-[#EDF3E5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#237344] lg:rounded-md lg:px-2">
              <WhatsAppIcon className="size-5" />
              <span className="hidden text-sm font-semibold lg:inline">WhatsApp Support</span>
            </a>
            <Link href="/form" className="hidden min-h-11 items-center rounded-xl bg-[#237344] px-5 text-sm font-bold text-white transition-colors hover:bg-[#195934] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344] lg:inline-flex">Register Free</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1248px] px-5 pb-8 pt-7 sm:px-8 sm:py-10 lg:px-12 lg:pb-8 lg:pt-10">
        <div className="mx-auto grid max-w-lg gap-y-5 sm:max-w-xl lg:max-w-none lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-x-12 lg:gap-y-5 xl:gap-x-16">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-end">
            <p className="mb-4 inline-flex rounded-full bg-[#E3EDD6] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#21472B] sm:text-xs">
              <span className="lg:hidden">Free live workshop</span>
              <span className="hidden lg:inline">Free live parenting workshop</span>
            </p>
            <h1 id="hero-heading" className="text-[clamp(1.875rem,8.4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.045em] lg:text-[clamp(2.5rem,3.8vw,3.25rem)]">
              Calmer parenting.<br />
              <span className="text-[#527840]">Stronger connections.</span>
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#596258] sm:text-base lg:mt-5 lg:text-lg">
              <span className="lg:hidden">Practical guidance to understand your child and build a happier home.</span>
              <span className="hidden lg:inline">Understand your child. Build calmer routines.<br />Create a happier home, together.</span>
            </p>
            <div aria-label="Workshop schedule: every Sunday at 11 AM IST" className="mt-5 flex items-center rounded-2xl bg-[#EAF0DE] px-3.5 py-4 sm:px-5 lg:mt-6 lg:max-w-[420px] lg:py-4">
              <div className="flex flex-1 items-center justify-center gap-2 border-r border-[#527840]/25 pr-3 text-xs font-semibold sm:text-base">
                <CalendarDays aria-hidden="true" className="size-5 shrink-0 sm:size-6" />
                <span>Every Sunday</span>
              </div>
              <div className="flex flex-1 items-center justify-center gap-2 pl-3 text-xs font-semibold sm:text-base">
                <Clock3 aria-hidden="true" className="size-5 shrink-0 sm:size-6" />
                <span>11:00 AM IST</span>
              </div>
            </div>
          </div>

          <figure className="grid min-w-0 grid-cols-[0.9fr_1fr] overflow-hidden rounded-3xl border border-[#103723]/5 bg-[#EDF2E4] lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:flex lg:w-[350px] lg:flex-col lg:self-center lg:justify-self-end lg:bg-white lg:p-3 lg:shadow-[0_12px_32px_rgba(16,55,35,0.07)]">
            <div className="relative min-h-40 sm:min-h-48 lg:h-[310px] lg:min-h-0 lg:overflow-hidden lg:rounded-2xl xl:h-80">
              <Image src="/profile.png" alt="Pravesh Gupta, your parenting workshop mentor" fill preload sizes="(min-width: 1024px) 324px, (min-width: 640px) 240px, 44vw" className="object-cover object-[center_30%] lg:object-[center_25%]" />
            </div>
            <figcaption className="flex flex-col justify-center px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-start lg:gap-4 lg:px-3 lg:py-4 lg:text-left">
              <span aria-hidden="true" className="hidden shrink-0 border-r border-[#103723]/15 pr-4 text-[#237344] lg:block"><Users className="size-7 stroke-[1.5]" /></span>
              <div>
                <p className="mb-2 text-xs text-[#527840] sm:text-sm lg:hidden">Your mentor</p>
                <p className="text-xl font-bold leading-tight tracking-tight sm:text-2xl">Pravesh Gupta</p>
                <span aria-hidden="true" className="my-3 block h-px w-9 bg-[#527840]/30 lg:hidden" />
                <p className="text-xs leading-relaxed text-[#596258] sm:text-sm lg:mt-1">Parenting Advisor</p>
              </div>
            </figcaption>
          </figure>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="flex items-stretch gap-3">
              <Link href="/form" className={`${registerButton} flex-1 sm:text-lg lg:min-h-13 lg:flex-none lg:px-6 lg:py-3.5 lg:text-base`}>
                Register Now — Free <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
              </Link>
              <div className="hidden lg:flex">
                <WhatsAppContactButton variant="outline" label="Ask a question" />
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-[#667060] sm:text-xs lg:text-left">Free registration <span aria-hidden="true">•</span> Live online workshop</p>
            <div className="mt-5 lg:hidden">
              <WhatsAppContactButton variant="outline" label="Chat on WhatsApp" />
            </div>
          </div>
        </div>

        <div className="mt-8 hidden border-y border-[#103723]/12 py-5 lg:block">
          <ul className="mx-auto grid max-w-5xl grid-cols-3 gap-6 text-sm text-[#34513C]">
            {[
              { Icon: Smile, text: "Understand emotions" },
              { Icon: HeartHandshake, text: "Build stronger connections" },
              { Icon: CalendarCheck2, text: "Create healthy routines" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center justify-center gap-3">
                <Icon aria-hidden="true" className="size-7 shrink-0 stroke-[1.5] text-[#237344]" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
