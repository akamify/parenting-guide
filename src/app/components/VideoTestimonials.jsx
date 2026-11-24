"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";

const testimonials = [
  {
    id: "1",
    title: "Understanding My Child's Tantrums",
    description:
      "I was struggling with my 4-year-old's daily meltdowns. Advisor Pravesh Kumar's techniques helped me understand the 'why' behind the behavior. Now, our home is much more peaceful, and I feel like a more confident parent.",
    videoId: "N8f2xLCBzJc",
    thumbnail: "/testimonials/img1.avif",
  },
  {
    id: "2",
    title: "Finally, A Screen-Free Routine",
    description:
      "Screen addiction was ruining our family dinners. The step-by-step guidance on setting boundaries without being a 'villain' worked like magic. My kids are now playing outdoors and reading more than ever.",
    videoId: "6Gr0PVTGNYo",
    thumbnail: "/testimonials/img2.avif",
  },
  {
    id: "3",
    title: "Building Deep Connection",
    description:
      "I felt like my teenager was drifting away. The communication strategies taught in this program helped us reconnect. We've gone from constant arguments to having meaningful conversations every night.",
    videoId: "vZsnbDKgNM8",
    thumbnail: "/testimonials/img3.avif",
  },
  {
    id: "4",
    title: "Positive Discipline That Works",
    description:
      "I never liked yelling, but I didn't know another way. This program showed me how to use positive discipline. It's not about being soft; it's about being effective. Truly a life-changing experience for us.",
    videoId: "lDZc958Bogo",
    thumbnail: "/testimonials/img4.webp",
  },
  {
    id: "5",
    title: "Single Parent Support",
    description:
      "Being a single mom is tough, but having a roadmap made it manageable. The advice on emotional resilience for both me and my child was exactly what I needed to hear during a difficult transition.",
    videoId: "jgg9uMB09fY",
    thumbnail: "/testimonials/img5.avif",
  },
  {
    id: "6",
    title: "Better Sleep for Everyone",
    description:
      "Bedtime used to be a 2-hour battle. With the new routine and behavioral shifts suggested by Pravesh ji, my kids now go to bed happily. I finally have some 'me-time' in the evenings!",
    videoId: "m-nuXsbI5B0",
    thumbnail: "/testimonials/img6.avif",
  },
];

const storyDetails = [
  { category: "Emotional connection", title: "Understanding my child's tantrums", excerpt: "I was struggling with my 4-year-old's daily meltdowns. Now, our home is much more peaceful." },
  { category: "Healthy routines", title: "A screen-free routine", excerpt: "Screen addiction was ruining our family dinners. My kids are now playing outdoors and reading more than ever." },
  { category: "Communication", title: "Building a deeper connection", excerpt: "I felt like my teenager was drifting away. We've gone from constant arguments to meaningful conversations." },
  { category: "Positive discipline", title: "Positive discipline that works", excerpt: "I never liked yelling, but I didn't know another way. This program showed me how to use positive discipline." },
  { category: "Parent support", title: "Support for single parents", excerpt: "Being a single mom is tough, but having a roadmap made it manageable." },
  { category: "Healthy routines", title: "Better sleep for everyone", excerpt: "Bedtime used to be a 2-hour battle. With the new routine, my kids now go to bed happily." },
];

const focusClass = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]";

function VideoCard({ story, details, isActive, onPlay, onClose }) {
  const [imageFailed, setImageFailed] = useState(false);
  const playRef = useRef(null);

  const closeVideo = () => {
    onClose();
    requestAnimationFrame(() => playRef.current?.focus({ preventScroll: true }));
  };

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-[#CCD5C7] bg-white shadow-[0_4px_12px_rgba(16,55,35,0.035)]">
      <div className="relative aspect-video w-full shrink-0 bg-[#EAF0DE]">
        {isActive ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${story.videoId}?autoplay=1&rel=0&playsinline=1`}
            title={details.title}
            className="absolute inset-0 size-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button ref={playRef} type="button" onClick={onPlay} aria-label={`Play story: ${details.title}`} className="group relative block size-full cursor-pointer focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#237344]">
            <Image src={imageFailed ? story.thumbnail : `https://i.ytimg.com/vi/${story.videoId}/hqdefault.jpg`} alt="" fill sizes="(min-width: 1280px) 370px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw" className="object-cover" onError={() => setImageFailed(true)} />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex size-14 items-center justify-center rounded-full border-2 border-white bg-[#237344] text-white shadow-md transition-colors group-hover:bg-[#195934] sm:size-16"><Play className="ml-0.5 size-6 fill-current stroke-[1.5]" aria-hidden="true" /></span>
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="mb-3 w-fit rounded-full bg-[#EAF0DE] px-3 py-1.5 text-[11px] font-semibold leading-4 text-[#345C33]">{details.category}</span>
        <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] text-[#103723] sm:text-xl">{details.title}</h3>
        <p className="mb-3 mt-3 text-sm leading-relaxed text-[#596258]">{details.excerpt}</p>
        <button type="button" onClick={isActive ? closeVideo : onPlay} aria-label={isActive ? `Close video: ${details.title}` : `Watch story: ${details.title}`} className={`mt-auto inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-md text-sm font-semibold text-[#237344] hover:text-[#195934] ${focusClass}`}>
          {isActive ? <>Close video<X className="size-4" aria-hidden="true" /></> : <>Watch story<ArrowRight className="size-4" aria-hidden="true" /></>}
        </button>
      </div>
    </article>
  );
}

export default function VideoTestimonials() {
  const id = useId();
  const railRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame;
    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia("(min-width: 640px)").matches) return;
        const index = cardRefs.current.reduce((nearest, card, i) =>
          Math.abs(card.offsetLeft - rail.scrollLeft) < Math.abs(cardRefs.current[nearest].offsetLeft - rail.scrollLeft) ? i : nearest, 0);
        setCurrentIndex(index);
        // Scrolling away stops the old player instead of leaving hidden audio running.
        setActiveVideoId((active) => active && active !== testimonials[index].id ? null : active);
      });
    };
    rail.addEventListener("scroll", updatePosition, { passive: true });
    const resize = new ResizeObserver(updatePosition);
    resize.observe(rail);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", updatePosition);
      resize.disconnect();
    };
  }, []);

  const moveTo = (index) => {
    const rail = railRef.current;
    const card = cardRefs.current[index];
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActiveVideoId(null);
  };

  const handleKeys = (event) => {
    // Keep arrow keys inside the player and focused buttons available to those controls.
    if (event.target !== event.currentTarget || window.matchMedia("(min-width: 640px)").matches) return;
    let next;
    if (event.key === "ArrowRight") next = Math.min(testimonials.length - 1, currentIndex + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, currentIndex - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = testimonials.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      moveTo(next);
    }
  };

  return (
    <section id="parent-stories" aria-labelledby={`${id}-title`} className="bg-[#FDFBF7] text-[#103723]">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8 sm:pb-14 lg:px-12 lg:pt-10">
        <div className="border-t border-[#103723]/12 pt-8 lg:border-t-0 lg:pt-0">
          <div className="mb-6 flex items-end justify-between gap-8 lg:mb-8">
            <div className="min-w-0">
              <p className="mb-4 inline-flex rounded-full bg-[#E3EDD6] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs">Parent stories</p>
              <h2 id={`${id}-title`} className="text-[clamp(1.75rem,7.5vw,2rem)] font-bold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[2.5rem]">Small changes.<br />Stronger family bonds.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#667060] sm:text-base"><span className="lg:hidden">Explore stories from our parenting community.</span><span className="hidden lg:inline">Explore the parenting experiences shared in our workshop community.</span></p>
            </div>
            <button type="button" aria-expanded={showAll} aria-controls={`${id}-stories`} onClick={() => { setShowAll(!showAll); setActiveVideoId(null); }} className={`hidden min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-md text-sm font-semibold text-[#237344] hover:text-[#195934] lg:inline-flex ${focusClass}`}>
              {showAll ? "Show fewer stories" : "View all stories"}<ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>

          <p id={`${id}-instructions`} className="sr-only">Swipe or use the previous and next buttons to browse stories. When the story list is focused, use left and right arrow keys.</p>
          <ul id={`${id}-stories`} ref={railRef} aria-label="Parent stories" aria-describedby={`${id}-instructions`} tabIndex={0} onKeyDown={handleKeys} className={`relative flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain rounded-2xl pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 ${focusClass}`}>
            {testimonials.map((story, index) => (
              <li key={story.id} ref={(element) => { cardRefs.current[index] = element; }} className={`min-w-0 shrink-0 basis-[calc(100%-2.5rem)] snap-start scroll-m-0 ${index > 2 && !showAll ? "lg:hidden" : ""}`}>
                <VideoCard story={story} details={storyDetails[index]} isActive={activeVideoId === story.id} onPlay={() => setActiveVideoId(story.id)} onClose={() => setActiveVideoId(null)} />
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-4 sm:hidden">
            <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-[#667060]">{currentIndex + 1} of {testimonials.length} stories</p>
            <div className="flex gap-3">
              <button type="button" aria-label="Previous story" aria-controls={`${id}-stories`} disabled={currentIndex === 0} onClick={() => moveTo(Math.max(0, currentIndex - 1))} className={`inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#237344] text-[#237344] transition-colors hover:bg-[#EAF0DE] disabled:cursor-default disabled:border-[#D4DCCF] disabled:text-[#A2ACA0] ${focusClass}`}><ChevronLeft className="size-5" aria-hidden="true" /></button>
              <button type="button" aria-label="Next story" aria-controls={`${id}-stories`} disabled={currentIndex === testimonials.length - 1} onClick={() => moveTo(Math.min(testimonials.length - 1, currentIndex + 1))} className={`inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#237344] text-[#237344] transition-colors hover:bg-[#EAF0DE] disabled:cursor-default disabled:border-[#D4DCCF] disabled:text-[#A2ACA0] ${focusClass}`}><ChevronRight className="size-5" aria-hidden="true" /></button>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-5 rounded-3xl bg-[#EAF0DE] p-5 sm:p-6 lg:mt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-7">
            <div><p className="text-xl font-bold leading-snug tracking-tight lg:text-2xl">Start your parenting journey.</p><p className="mt-2 text-xs leading-relaxed text-[#667060] sm:text-sm"><span className="hidden sm:inline">Free live workshop &middot; </span>Every Sunday &middot; 11:00 AM IST</p></div>
            <Link href="/form" className={`inline-flex min-h-13 shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#237344] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#195934] sm:text-base ${focusClass}`}>Join the free workshop<ArrowRight className="size-5 shrink-0" aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
