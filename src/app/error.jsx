"use client";
import Link from "next/link";
export default function ErrorPage({ reset }) {
  return <main id="main-content" tabIndex={-1} className="grid min-h-[70svh] place-items-center bg-[#FDFBF7] px-5 py-16 text-[#103723]"><div className="max-w-md text-center"><h1 className="text-3xl font-bold">Something went wrong</h1><p className="mt-4 text-sm leading-relaxed text-[#596258]">Please try again. If the problem continues, contact us on WhatsApp.</p><button onClick={reset} className="mt-6 min-h-12 rounded-xl bg-[#237344] px-5 font-semibold text-white">Try again</button><Link href="/" className="ml-5 inline-flex min-h-12 items-center text-sm text-[#237344] underline">Back home</Link></div></main>;
}
