import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { readAllLeads } from "../../lib/googleSheet";
import { deliverReminder, reminderTypes } from "../../lib/reminders";
import { getWebinarReminderTimes } from "../../lib/webinar";
import { isWhatsAppSendingEnabled } from "../../lib/waspakamify";

export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  const supplied = req.headers.get("authorization")?.replace(/^Bearer /i, "") || new URL(req.url).searchParams.get("secret") || "";
  if (!secret || Buffer.byteLength(supplied) !== Buffer.byteLength(secret) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(secret))) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!isWhatsAppSendingEnabled()) return NextResponse.json({ ok: true, skipped: true });
  try {
    const leads = await readAllLeads();
    const counts = { sent: 0, failed: 0, skipped: 0 };
    const now = Date.now();
    for (let i = 0; i < leads.length; i++) {
      const row = leads[i];
      const webinar = new Date(row[8]);
      if (!Number.isFinite(webinar.getTime())) continue;
      const times = getWebinarReminderTimes(webinar);
      for (const type of reminderTypes) {
        if (now < times[type] || now - times[type] > 30 * 60_000) continue;
        try {
          const result = await deliverReminder(i + 2, type, row[14]);
          counts[result.skipped ? "skipped" : "sent"]++;
        } catch { counts.failed++; }
      }
    }
    return NextResponse.json({ ok: true, counts });
  } catch {
    console.error("Cron could not read registrations");
    return NextResponse.json({ ok: false, message: "Reminder service unavailable" }, { status: 503 });
  }
}
