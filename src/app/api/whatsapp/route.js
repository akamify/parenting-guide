import { NextResponse } from "next/server";
import { validateForm } from "../../lib/validate";
import { findActiveLeadByContact, saveToSheet, markCell, LEAD_STATUS_COLUMNS } from "../../lib/googleSheet";
import { isWhatsAppSendingEnabled, sendConfirmation } from "../../lib/waspakamify";
import { getQstashTargetUrl, publishScheduled, toEpochSeconds } from "../../lib/qstash";
import { formatWebinarParts, getNextWebinarDate, getUpcomingWebinarReminders, getWebinarReminderTimes } from "../../lib/webinar";
import { checkOrigin, rateLimit, readJson, withLock } from "../../lib/requestGuard";

export async function POST(req) {
  try {
    checkOrigin(req);
    await rateLimit(req, "register");
    const normalized = validateForm(await readJson(req), { requireConsent: true });
    return await withLock(`registration:phone:${normalized.phone}`, () => withLock(`registration:email:${normalized.email}`, async () => {
      const activeLead = await findActiveLeadByContact({ email: normalized.email, phone10: normalized.phone });
      if (activeLead) return NextResponse.json({ success: false, message: "You are already registered for a webinar. Please wait until it is completed before submitting again." }, { status: 409 });
      const leadId = crypto.randomUUID();
      const registeredAt = new Date();
      const webinarDT = getNextWebinarDate(registeredAt);
      const meta = formatWebinarParts(webinarDT);
      const webinarISO = webinarDT.toISOString();
      const reminders = getUpcomingWebinarReminders(webinarDT, registeredAt);
      const skippedReminders = Object.keys(getWebinarReminderTimes(webinarDT)).filter(type => !reminders.some(([upcoming]) => upcoming === type));
      const { rowNumber } = await saveToSheet({ ...normalized, phone: normalized.phone, source: process.env.NODE_ENV === "production" ? "website-prod" : "website-local", ...meta, webinarISO, leadId, skippedReminders, consentAt: registeredAt.toISOString() });
      const enabled = isWhatsAppSendingEnabled();
      let confirmationStatus = enabled ? "failed" : "disabled";
      if (enabled) {
        try {
          await sendConfirmation({ name: normalized.name, email: normalized.email, phone10: normalized.phone, webinarMeta: { ...meta, webinarISO } });
          confirmationStatus = "yes";
        } catch { console.error("Confirmation provider rejected request", { leadId }); }
      }
      if (rowNumber) {
        try { await markCell(rowNumber, LEAD_STATUS_COLUMNS.confirmation, confirmationStatus); }
        catch { console.error("Confirmation status update failed", { leadId }); }
      }
      if (rowNumber && enabled) {
        try {
          const url = `${getQstashTargetUrl(req.url)}/api/qstash/`;
          const payload = { rowNumber, leadId, webinarISO };
          const results = await Promise.allSettled(reminders.map(async ([type, scheduledAt]) => {
            if (scheduledAt <= Date.now()) return markCell(rowNumber, LEAD_STATUS_COLUMNS[type], "skipped");
            return publishScheduled({ url, body: { type, ...payload }, notBeforeEpochSeconds: toEpochSeconds(scheduledAt) });
          }));
          if (results.some(result => result.status === "rejected")) console.error("Some reminders need cron recovery", { leadId });
        } catch { console.error("Reminder scheduling needs cron recovery", { leadId }); }
      }
      // The lead is saved. A notification outage must not invite duplicate registration.
      return NextResponse.json({ success: true, message: "Registration saved.", webinar: { ...meta, webinarISO } });
    }));
  } catch (error) {
    if (error.fieldErrors) return NextResponse.json({ success: false, message: error.message, fieldErrors: error.fieldErrors }, { status: 400 });
    if (error.status) return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    console.error("Registration service unavailable");
    return NextResponse.json({ success: false, message: "Registration is temporarily unavailable. Your details are still here. Please try again shortly." }, { status: 503 });
  }
}
