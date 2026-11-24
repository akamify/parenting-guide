import Image from "next/image";
import { CalendarDays, MapPin, Users } from "lucide-react";

export default function GalleryCard({ image, title, event, participants, location, date, highlight }) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-[#D5DECF] bg-white shadow-[0_4px_12px_rgba(16,55,35,0.035)]">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-[#EAF0DE]">
        <Image src={image} alt={title} fill sizes="(min-width: 1280px) 370px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
        {highlight && <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full border border-[#D5DECF] bg-[#FDFBF7] px-3 py-1.5 text-[10px] font-semibold text-[#345C33]">{highlight}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] text-[#103723]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#596258]">{event}</p>
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs leading-relaxed text-[#596258]">
            {participants && <span className="inline-flex items-center gap-1.5"><Users aria-hidden="true" className="size-3.5 shrink-0 text-[#237344]" />{participants}</span>}
            {date && <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="size-3.5 shrink-0 text-[#237344]" />{date}</span>}
          </div>
          {location && <p className="mt-3 flex items-start gap-1.5 border-t border-[#103723]/8 pt-3 text-xs leading-relaxed text-[#596258]"><MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[#237344]" />{location}</p>}
        </div>
      </div>
    </article>
  );
}
