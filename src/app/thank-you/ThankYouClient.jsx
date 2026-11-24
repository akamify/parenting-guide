"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { readRegistration, safeExternalUrl } from "../lib/display";
import WhatsAppContactButton from "../components/WhatsAppContactButton";
import SuccessVideo from "./SuccessVideo";

export default function ThankYouClient({ communityLink, eventName }) {
  const [data, setData] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      let saved = null;
      try { saved = readRegistration(localStorage); } catch { /* Browser storage can be blocked. */ }
      if (!saved) { try { saved = readRegistration(sessionStorage); } catch { /* Show the recovery view. */ } }
      setData(saved); setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const community = safeExternalUrl(communityLink || process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL);
  const buttonClass = "inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#237344] px-4 py-4 text-sm font-bold text-white hover:bg-[#195934] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]";
  return (
    <main id="main-content" tabIndex={-1} className="min-h-svh bg-[#FDFBF7] px-5 py-8 text-[#103723] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-[#237344] focus-visible:outline-2 focus-visible:outline-[#237344]"><ArrowLeft aria-hidden="true" className="size-4" />Back to workshop</Link>
        {!ready ? <div role="status" className="py-16 text-center text-sm">Loading your confirmation…</div> : !data ? (
          <div className="rounded-3xl border border-[#D5DECF] bg-white p-6 sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight">Looking for your confirmation?</h1><p className="mt-4 text-sm leading-relaxed text-[#596258]">Your saved confirmation may have expired or browser storage may be unavailable. If you already registered, contact us on WhatsApp for help.</p>
            <div className="mt-6"><WhatsAppContactButton variant="outline" label="Get registration help" /></div><Link href="/form" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#237344] underline">Register for the workshop</Link>
          </div>
        ) : (
          <article className="overflow-hidden rounded-3xl border border-[#D5DECF] bg-white shadow-sm">
            <div className="bg-[#EAF0DE] p-6 text-center sm:p-8"><CheckCircle2 className="mx-auto mb-4 size-12 text-[#237344]" aria-hidden="true" /><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">You’re registered!</h1><p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#596258]">Your place in the parenting workshop is saved. Here are your registration details.</p></div>
            <div className="p-5 sm:p-8">
              <SuccessVideo />
              <section aria-labelledby="confirmation-schedule" className="rounded-2xl bg-[#F1F5EB] p-5"><h2 id="confirmation-schedule" className="text-lg font-bold">Your workshop</h2><p className="mt-1 text-sm text-[#596258]">{eventName || "Mindful Parenting Workshop"}</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><p className="flex items-start gap-2 text-sm"><CalendarDays aria-hidden="true" className="size-5 shrink-0 text-[#237344]" /><span>{data.webinarDay}<br />{data.webinarDate}</span></p><p className="flex items-center gap-2 text-sm"><Clock3 aria-hidden="true" className="size-5 shrink-0 text-[#237344]" />{data.webinarTime} IST</p></div></section>
              <section aria-labelledby="confirmation-contact" className="my-6"><h2 id="confirmation-contact" className="text-lg font-bold">Your details</h2><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div className="min-w-0"><dt className="text-xs text-[#667060]">Parent’s name</dt><dd className="mt-1 break-words font-semibold">{data.name}</dd></div><div className="min-w-0"><dt className="text-xs text-[#667060]">WhatsApp number</dt><dd className="mt-1 font-semibold">+91 {data.phone}</dd></div><div className="min-w-0 sm:col-span-2"><dt className="text-xs text-[#667060]">Email</dt><dd className="mt-1 break-all font-semibold">{data.email}</dd></div></dl></section>
              {community && <a href={community} target="_blank" rel="noopener noreferrer" className={buttonClass}>Join WhatsApp Community<ArrowRight aria-hidden="true" className="size-4 shrink-0" /></a>}
              <div className="mt-4"><WhatsAppContactButton variant="outline" label="Need help? Chat with us" /></div>
              <p className="mt-5 text-center text-xs leading-relaxed text-[#667060]">Keep these workshop details handy. If a WhatsApp message doesn’t arrive, contact support.</p>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
