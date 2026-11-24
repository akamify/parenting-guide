"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarDays, CalendarCheck2, CheckCircle2, Clock3, HeartHandshake, Loader2, Users } from "lucide-react";
import { formatWebinarParts, getNextWebinarDate } from "../lib/webinar";
import { getRegistrationErrors, validateForm } from "../lib/validate";
import WhatsAppContactButton from "./WhatsAppContactButton";

const fieldOrder = ["name", "email", "phone", "whatsappConsent"];
const buttonClass = "inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#237344] px-4 py-4 text-base font-bold text-white transition-colors hover:bg-[#195934] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#237344] disabled:cursor-wait disabled:bg-[#7C9D83]";

function WorkshopSchedule() {
  return (
    <div className="flex items-center rounded-2xl bg-[#EAF0DE] px-3 py-4 text-xs font-semibold sm:px-5 sm:text-sm" aria-label="Workshop: every Sunday, 11 AM IST">
      <span className="flex flex-1 items-center justify-center gap-2 border-r border-[#527840]/25 pr-3"><CalendarDays className="size-5 shrink-0" aria-hidden="true" />Every Sunday</span>
      <span className="flex flex-1 items-center justify-center gap-2 pl-3"><Clock3 className="size-5 shrink-0" aria-hidden="true" />11:00 AM IST</span>
    </div>
  );
}

export default function LearningForm({ showStickyBar = true }) {
  const router = useRouter();
  const id = useId();
  const formRef = useRef(null);
  const submittingRef = useRef(false);
  const requestRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", whatsappConsent: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const SuccessHeading = showStickyBar ? "h2" : "h1";

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    if (!showStickyBar) return;
    const hero = document.getElementById("hero");
    const stories = document.getElementById("parent-stories");
    const form = formRef.current;
    const inlineCtas = [...document.querySelectorAll("[data-registration-cta]")];
    const visibleCtas = new Set();
    if (!hero || !form) return;
    let heroVisible = true;
    let formVisible = false;
    let storiesVisible = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === form) formVisible = entry.isIntersecting;
        if (entry.target === stories) storiesVisible = entry.isIntersecting;
        if (inlineCtas.includes(entry.target)) {
          if (entry.isIntersecting) visibleCtas.add(entry.target);
          else visibleCtas.delete(entry.target);
        }
      }
      setStickyVisible(!heroVisible && !formVisible && !storiesVisible && visibleCtas.size === 0);
    });
    observer.observe(hero);
    observer.observe(form);
    if (stories) observer.observe(stories);
    inlineCtas.forEach((cta) => observer.observe(cta));
    return () => observer.disconnect();
  }, [showStickyBar]);

  const focusFirstError = (fieldErrors) => {
    const first = fieldOrder.find((field) => fieldErrors[field]);
    if (first) formRef.current?.elements.namedItem(first)?.focus();
  };

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    const next = { ...formData, [name]: type === "checkbox" ? checked : value };
    setFormData(next);
    if (touched[name]) {
      const nextErrors = getRegistrationErrors(next);
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
    }
    setErrorMessage("");
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: getRegistrationErrors(formData)[name] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current || successData) return;
    const fieldErrors = getRegistrationErrors(formData);
    setTouched(Object.fromEntries(fieldOrder.map((field) => [field, true])));
    setErrors(fieldErrors);
    setErrorMessage("");
    if (Object.keys(fieldErrors).length) {
      focusFirstError(fieldErrors);
      return;
    }
    submittingRef.current = true;
    setIsSubmitting(true);
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const normalized = validateForm(formData, { requireConsent: true });
      const response = await fetch("/api/whatsapp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized), signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        if (result?.fieldErrors) {
          setErrors(result.fieldErrors);
          focusFirstError(result.fieldErrors);
        }
        setErrorMessage(result?.message || "We couldn’t complete your registration. Your details are still here. Please try again.");
        return;
      }
      const webinar = result.webinar || formatWebinarParts(getNextWebinarDate());
      const saved = { ...normalized, ...webinar, timestamp: new Date().toISOString() };
      setSuccessData(saved);
      // A storage restriction must not turn a successful registration into an error.
      // Show the inline confirmation if the thank-you page cannot read browser storage.
      try {
        sessionStorage.setItem("thankyouData", JSON.stringify(saved));
        router.push("/thank-you");
      } catch {
        // The inline confirmation below remains visible.
      }
    } catch (error) {
      setErrorMessage(error.name === "AbortError"
        ? "This is taking longer than expected. Your details are still here. Please try again or contact us on WhatsApp."
        : "Couldn’t connect. Your details are still here. Check your connection and try again.");
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) => `min-h-13 w-full min-w-0 rounded-xl border bg-white px-4 py-3 text-base text-[#103723] outline-none placeholder:text-[#7A827A] focus:ring-3 disabled:bg-[#F2F4EF] ${errors[field] ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/10" : "border-[#BCC5BC] focus:border-[#237344] focus:ring-[#237344]/10"}`;
  const errorRow = (field) => (
    <p id={`${id}-${field}-help`} aria-live="polite" className={`mt-1.5 min-h-5 text-xs leading-5 ${errors[field] ? "text-[#B42318]" : "text-[#667060]"}`}>
      {errors[field] || (field === "phone" ? "Use the number you check on WhatsApp." : "\u00a0")}
    </p>
  );

  return (
    <section aria-labelledby={`${id}-title`} className="min-h-svh bg-[#FDFBF7] text-[#103723]">
      {!showStickyBar && (
        <header className="border-b border-[#103723]/8 bg-white">
          <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <Link href="/" aria-label="Back to workshop" className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-[#EDF3E5] focus-visible:outline-2 focus-visible:outline-[#237344] lg:hidden"><ArrowLeft className="size-5" aria-hidden="true" /></Link>
              <Link href="/" className="flex min-w-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-[#237344]">
                <Image src="/logo.png" alt="" width={44} height={44} className="size-10 shrink-0 object-contain" />
                <span className="text-sm font-bold tracking-tight sm:text-xl">Parenting Guide</span>
              </Link>
            </div>
            <div className="shrink-0"><WhatsAppContactButton variant="outline" /></div>
          </div>
        </header>
      )}
      <div className="mx-auto max-w-6xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-7 sm:px-8 sm:py-10 lg:py-10">
        {!showStickyBar && <Link href="/" className="mb-8 hidden min-h-11 w-fit items-center gap-2 rounded-lg text-sm font-semibold text-[#237344] hover:underline focus-visible:outline-2 focus-visible:outline-[#237344] lg:inline-flex"><ArrowLeft className="size-4" aria-hidden="true" />Back to workshop</Link>}
        <div className="mx-auto grid max-w-lg items-start gap-10 lg:max-w-none lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 xl:gap-16">
          <aside aria-label="About the workshop" className="hidden min-w-0 lg:block lg:pt-5">
            <span className="inline-flex rounded-full bg-[#E3EDD6] px-4 py-2 text-xs font-bold uppercase tracking-wider">Free live workshop</span>
            <h2 className="mt-5 text-[clamp(2.25rem,3.8vw,3rem)] font-bold leading-[1.1] tracking-[-0.04em]">A calmer home<br />starts here.</h2>
            <p className="mb-7 mt-4 max-w-sm text-base leading-relaxed text-[#596258]">Practical guidance for more connected parenting.</p>
            <WorkshopSchedule />
            <figure className="mt-7 flex items-center gap-5 overflow-hidden rounded-2xl border border-[#103723]/10 bg-white p-3 shadow-sm">
              <div className="relative size-28 shrink-0 overflow-hidden rounded-xl"><Image src="/profile.png" alt="Pravesh Gupta" fill sizes="112px" className="object-cover object-[center_20%]" /></div>
              <figcaption className="min-w-0 py-3"><p className="text-xs text-[#667060]">Your mentor</p><p className="mt-1 text-xl font-bold">Pravesh Gupta</p><p className="mt-1 text-sm text-[#596258]">Parenting Advisor</p></figcaption>
            </figure>
            <ul className="mt-7 grid grid-cols-3 gap-4 text-center text-xs leading-relaxed text-[#34513C]">
              {[
                { Icon: Users, label: "Understand your child" },
                { Icon: HeartHandshake, label: "Build stronger connections" },
                { Icon: CalendarCheck2, label: "Create healthier routines" },
              ].map(({ Icon, label }) => <li key={label} className="flex flex-col items-center gap-3"><span className="rounded-xl bg-[#EAF0DE] p-3"><Icon className="size-6" aria-hidden="true" /></span>{label}</li>)}
            </ul>
          </aside>
          <div className="min-w-0 lg:rounded-3xl lg:border lg:border-[#103723]/12 lg:bg-white lg:p-8 lg:shadow-[0_8px_24px_rgba(16,55,35,0.05)] xl:p-9">
            {successData ? (
              <div role="status" className="py-8 text-center">
                <CheckCircle2 className="mx-auto size-12 text-[#237344]" aria-hidden="true" />
                <SuccessHeading id={`${id}-title`} className="mt-5 text-3xl font-bold">You’re registered!</SuccessHeading>
                <p className="mt-4 text-sm leading-relaxed text-[#596258]">Your workshop is on {successData.webinarDay}, {successData.webinarDate} at {successData.webinarTime} IST.</p>
                <div className="mt-6"><WhatsAppContactButton variant="outline" label="Need help? Chat with us" /></div>
              </div>
            ) : (
              <>
                <span className="mb-4 inline-flex rounded-full bg-[#E3EDD6] px-3 py-2 text-[10px] font-bold uppercase tracking-wider lg:hidden">Free live workshop</span>
                {showStickyBar ? <h2 id={`${id}-title`} className="text-3xl font-bold leading-[1.12] tracking-[-0.035em]">Join the free workshop</h2> : <h1 id={`${id}-title`} className="text-3xl font-bold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-3xl">Join the free workshop</h1>}
                <p className="mt-3 text-sm leading-relaxed text-[#596258]"><span className="lg:hidden">A calmer home starts with one small step.</span><span className="hidden lg:inline">Enter your details to reserve your place.</span></p>
                <div className="mt-5 lg:hidden"><WorkshopSchedule /></div>
                <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="mt-6">
                  <fieldset disabled={isSubmitting} className="min-w-0 space-y-3">
                    <legend className="sr-only">Your registration details. All fields are required.</legend>
                    <div>
                      <label htmlFor={`${id}-name`} className="mb-2 block text-sm font-semibold">Parent’s full name</label>
                      <input id={`${id}-name`} name="name" type="text" autoComplete="name" maxLength={100} required value={formData.name} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.name} aria-describedby={`${id}-name-help`} placeholder="e.g. Rahul Singh" className={inputClass("name")} />
                      {errorRow("name")}
                    </div>
                    <div>
                      <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-semibold">Email address</label>
                      <input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} required value={formData.email} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.email} aria-describedby={`${id}-email-help`} placeholder="you@example.com" className={inputClass("email")} />
                      {errorRow("email")}
                    </div>
                    <div>
                      <label htmlFor={`${id}-phone`} className="mb-2 block text-sm font-semibold">WhatsApp number</label>
                      <div className="relative">
                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-3 left-0 flex w-16 items-center justify-center border-r border-[#BCC5BC] text-base font-semibold">+91</span>
                        <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={24} required value={formData.phone} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.phone} aria-describedby={`${id}-phone-help`} aria-label="WhatsApp number, India country code plus 91" placeholder="10-digit mobile number" className={`${inputClass("phone")} pl-20`} />
                      </div>
                      {errorRow("phone")}
                    </div>
                    <div>
                      <label className="flex min-h-11 cursor-pointer items-start gap-3 text-xs leading-5 text-[#455745] sm:text-sm">
                        <input name="whatsappConsent" type="checkbox" required checked={formData.whatsappConsent} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.whatsappConsent} aria-describedby={`${id}-whatsappConsent-help`} className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#237344] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#237344]" />
                        <span>Send me workshop details and reminders on WhatsApp.</span>
                      </label>
                      {errorRow("whatsappConsent")}
                    </div>
                  </fieldset>
                  {errorMessage && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-[#E4C17C] bg-[#FFF8E8] p-3 text-sm leading-relaxed text-[#795220]"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span>{errorMessage}</span></div>}
                  <button type="submit" disabled={isSubmitting} className={buttonClass}>
                    {isSubmitting ? <><Loader2 className="size-5 animate-spin" aria-hidden="true" />Registering…</> : <>Reserve My Free Spot<ArrowRight className="size-5 shrink-0" aria-hidden="true" /></>}
                  </button>
                  <p role="status" aria-live="polite" className="sr-only">{isSubmitting ? "Registering. Please wait." : ""}</p>
                  <p className="mt-4 text-center text-[11px] leading-5 text-[#667060]">By registering, you agree to our <Link href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="font-medium text-[#237344] underline underline-offset-2">Terms</Link> &amp; <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-[#237344] underline underline-offset-2">Privacy Policy</Link>.</p>
                  <div className="mt-5"><WhatsAppContactButton variant="outline" label="Need help? Chat with us" /></div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      {showStickyBar && stickyVisible && !successData && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#103723]/10 bg-white px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden">
          <div className="mx-auto flex max-w-lg items-stretch gap-3"><Link href="/form" className={buttonClass}>Register Now — Free<ArrowRight className="size-5" aria-hidden="true" /></Link><WhatsAppContactButton variant="outline" /></div>
        </div>
      )}
    </section>
  );
}
