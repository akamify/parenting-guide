import { LEAD_STATUS_COLUMNS, markCell, readLead, readLeadStatus } from "./googleSheet";
import { cleanPhone10 } from "./phone";
import { getWebinarReminderTimes } from "./webinar";
import { withLock } from "./requestGuard";
import { isWhatsAppSendingEnabled, send1DayReminder, sendMorningReminder, send10MinReminder, sendLiveNow } from "./waspakamify";

export const reminderTypes = ["1day", "morning", "10min", "live"];
const senders = { "1day": send1DayReminder, morning: sendMorningReminder, "10min": send10MinReminder, live: sendLiveNow };
export async function deliverReminder(rowNumber, type, expectedLeadId) {
  if (!Object.hasOwn(senders, type)) return { skipped: true, reason: "unknown-type" };
  return withLock(`reminder:${rowNumber}:${type}`, async () => {
    const row = await readLead(rowNumber);
    if (!row || (expectedLeadId && row[14] !== expectedLeadId)) return { skipped: true, reason: "lead-not-found" };
    if (["yes", "skipped", "disabled"].includes(readLeadStatus(row, type))) return { skipped: true, reason: "already-processed" };
    if (row[15] && row[15] !== "yes") return { skipped: true, reason: "no-consent" };
    const webinar = new Date(row[8]);
    if (!Number.isFinite(webinar.getTime())) return { skipped: true, reason: "invalid-date" };
    const scheduledAt = getWebinarReminderTimes(webinar)[type];
    const now = Date.now();
    const configured = Number(process.env.CRON_WINDOW_MINUTES || 5);
    const windowMs = (Number.isFinite(configured) && configured > 0 ? Math.min(configured, 30) : 5) * 60_000;
    if (now < scheduledAt) return { skipped: true, reason: "not-due" };
    if (now >= scheduledAt + windowMs || (type !== "live" && now >= webinar.getTime())) return { skipped: true, reason: "expired" };
    if (!isWhatsAppSendingEnabled()) return { skipped: true, reason: "disabled" };
    await senders[type]({ name: String(row[1] || ""), phone10: cleanPhone10(row[3]), webinarDay: row[5], webinarDate: row[6], webinarTime: row[7] });
    await markCell(rowNumber, LEAD_STATUS_COLUMNS[type], "yes");
    return { skipped: false };
  });
}
