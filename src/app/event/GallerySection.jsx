"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import GalleryCard from "./GalleryCard";

const galleryItems = [
  {
    image: "/moments/img2.avif",
    title: "The Conscious Parent Meet",
    event: "Deep dive into child psychology and emotional intelligence for modern families.",
    participants: "200+ Parents",
    location: "Mumbai",
    date: "Jan 2026",
    highlight: "Interactive",
  },
  {
    image: "/moments/img1.avif",
    title: "Live Q&A: Screen Time Control",
    event: "Practical workshop on managing digital habits and improving focus in children.",
    participants: "150+ Families",
    location: "Delhi (Live Session)",
    date: "Feb 2026",
    highlight: "Housefull",
  },
  {
    image: "/moments/img3.avif",
    title: "Advanced Parent Graduation",
    event: "Celebrating parents who completed our 6-month mentorship program.",
    participants: "80+ Certified",
    location: "Lucknow",
    date: "Dec 2025",
    highlight: "Top Success Rate",
  },
  {
    image: "/moments/img4.avif",
    title: "Bonding Beyond Boundaries",
    event: "A special session dedicated to father-child relationship strengthening.",
    participants: "120+ Active",
    location: "Jaipur",
    date: "Nov 2025",
  },
  {
    image: "/moments/img5.avif",
    title: "Modern Parenting Foundation",
    event: "Essential concepts for new parents starting their journey with us.",
    participants: "300+ Participants",
    location: "Online",
    date: "Oct 2025",
  },
  {
    image: "/moments/img6.avif",
    title: "Excellence Awards 2025",
    event: "Recognizing extraordinary transformations in parent-child relationships.",
    participants: "25 Winners",
    location: "Annual Gala",
    date: "Dec 2025",
    highlight: "Awards Ceremony",
  },
];

export default function GallerySection() {
  const [showAll, setShowAll] = useState(false);
  const id = useId();
  return (
    <section id="gallery" aria-labelledby={`${id}-title`} className="bg-[#FDFBF7] text-[#103723]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mb-7 max-w-2xl lg:mb-9">
          <p className="mb-4 inline-flex rounded-full bg-[#E3EDD6] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs">Community moments</p>
          <h2 id={`${id}-title`} className="text-[clamp(1.75rem,7.5vw,2rem)] font-bold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[2.5rem]">Growing together.<br />One connection at a time.</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#596258] sm:text-base">A look at the conversations, learning and shared moments in our parenting community.</p>
        </div>
        <ul id={`${id}-moments`} className="grid items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {galleryItems.map((item, index) => <li key={item.image} className={`min-w-0 ${!showAll && index >= 3 ? "hidden" : ""}`}><GalleryCard {...item} /></li>)}
        </ul>
        <div className="mt-6 flex justify-center">
          <button type="button" aria-expanded={showAll} aria-controls={`${id}-moments`} onClick={() => setShowAll(!showAll)} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#CCD5C7] bg-white px-5 py-3 text-sm font-semibold text-[#237344] transition-colors hover:bg-[#EAF0DE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]">{showAll ? <>Show fewer moments<ChevronUp className="size-4" aria-hidden="true" /></> : <>View all {galleryItems.length} moments<ChevronDown className="size-4" aria-hidden="true" /></>}</button>
        </div>
        <div data-registration-cta className="mt-8 flex flex-col gap-5 rounded-3xl bg-[#EAF0DE] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-7">
          <div><p className="text-xl font-bold leading-snug tracking-tight lg:text-2xl">Make space for a calmer home.</p><p className="mt-2 text-sm leading-relaxed text-[#596258]">Join our free live workshop. Every Sunday at 11:00 AM IST.</p></div>
          <Link href="/form" className="inline-flex min-h-13 shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#237344] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#195934] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]">Reserve my free spot<ArrowRight className="size-5 shrink-0" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
