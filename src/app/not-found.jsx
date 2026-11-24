import Link from "next/link";
export default function NotFound() {
  return <main id="main-content" tabIndex={-1} className="grid min-h-[70svh] place-items-center bg-[#FDFBF7] px-5 py-16 text-[#103723]"><div className="max-w-md text-center"><p className="text-sm font-semibold text-[#527840]">404</p><h1 className="mt-3 text-3xl font-bold">This page isn’t available</h1><p className="mt-4 text-sm leading-relaxed text-[#596258]">Explore the free parenting workshop or get in touch if you need help.</p><Link href="/" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[#237344] px-5 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344]">Back to the workshop</Link></div></main>;
}
