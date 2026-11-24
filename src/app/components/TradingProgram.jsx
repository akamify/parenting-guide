import Link from "next/link";
import { ArrowRight, Brain, HeartHandshake, MessageCircleHeart, Smartphone, Sparkles } from "lucide-react";

const highlights = [
  { title: "Understand your child", description: "Bachon ke behaviour ke peeche ka reason samjhein aur unse behtar connect karein.", Icon: Brain },
  { title: "Respond without shouting", description: "Gussa kiye bina apni baat samjhane ke liye practical steps seekhein.", Icon: MessageCircleHeart },
  { title: "Build a healthier digital routine", description: "Mobile aur screen time ke liye clear boundaries aur balanced habits banayein.", Icon: Smartphone },
  { title: "Create deeper connections", description: "Roz ke chhote moments ko trust aur bonding badhane ka mauka banayein.", Icon: HeartHandshake },
  { title: "Put learning into practice", description: "Simple exercises aur everyday methods jo aap apne ghar mein use kar sakein.", Icon: Sparkles },
];

export default function ParentingProgram() {
  return (
    <section id="program" aria-labelledby="program-title" className="bg-[#F1F5EB] text-[#103723]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mb-7 max-w-2xl lg:mb-9">
          <p className="mb-4 inline-flex rounded-full bg-[#E3EDD6] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs">What you will learn</p>
          <h2 id="program-title" className="text-[clamp(1.75rem,7.5vw,2rem)] font-bold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[2.5rem]">Practical skills.<br />Everyday connection.</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#596258] sm:text-base">Parenting ko asaan banane aur bachon ke saath bond majboot karne ke liye practical guidance.</p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {highlights.map(({ title, description, Icon }, index) => (
            <li key={title} className={`min-w-0 rounded-[1.25rem] border border-[#D5DECF] bg-white p-5 sm:p-6 ${index === 4 ? "sm:col-span-2" : ""}`}>
              <div className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF0DE] text-[#237344]"><Icon aria-hidden="true" className="size-6 stroke-[1.5]" /></span>
                <div className="min-w-0 flex-1"><p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#667060]">Topic {String(index + 1).padStart(2, "0")}</p><h3 className="text-base font-bold leading-snug tracking-tight sm:text-lg">{title}</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#596258]">{description}</p></div>
              </div>
            </li>
          ))}
        </ol>
        <div data-registration-cta className="mt-7 flex flex-col gap-4 border-t border-[#103723]/12 pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-8">
          <p className="text-sm leading-relaxed text-[#596258]">Learn together in the free Sunday workshop.<br /><span className="font-semibold text-[#103723]">Every Sunday &middot; 11:00 AM IST</span></p>
          <Link href="/form" className="inline-flex min-h-13 shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#237344] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#195934] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]">Join the free workshop<ArrowRight aria-hidden="true" className="size-5" /></Link>
        </div>
      </div>
    </section>
  );
}
