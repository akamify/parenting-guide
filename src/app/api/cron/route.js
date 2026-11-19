// src/app/api/cron/route.js
import { NextResponse } from "next/server";
import { readAllLeads, markCell } from "../../lib/googleSheet";
import {
  isWhatsAppSendingEnabled,
  send1DayReminder,
  sendMorningReminder,
  send10MinReminder,
  sendLiveNow,
} from "../../lib/waspakamify";
import { getWebinarReminderTimes } from "../../lib/webinar";

// 0-based indexes for A:O
const COL_NAME = 1;         // B
const COL_PHONE = 3;        // D
const COL_WEBINAR_DAY = 5;  // F
const COL_WEBINAR_DATE = 6; // G
const COL_WEBINAR_TIME = 7; // H
const COL_WEBINAR_ISO = 8;  // I

const COL_SENT_CONFIRM = 9; // J
const COL_SENT_1DAY = 10;   // K
const COL_SENT_10MIN = 11;  // L
const COL_SENT_LIVE = 12;   // M
const COL_SENT_MORNING = 14; // O

const LETTER_SENT_CONFIRM = "J";
const LETTER_SENT_1DAY = "K";
const LETTER_SENT_10MIN = "L";
const LETTER_SENT_LIVE = "M";
const LETTER_SENT_MORNING = "O";

function isAuthorized(req) {
  // for GitHub Actions: /api/cron?secret=XXXX
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  return secret && secret === process.env.CRON_SECRET;
}

export async function GET(req) {
  try {
    if (process.env.CRON_SECRET && !isAuthorized(req)) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const leads = await readAllLeads();
    const now = new Date();

    const MIN = 60 * 1000;
    const WINDOW_MIN = Number(process.env.CRON_WINDOW_MINUTES || 5);
    const WINDOW_MS = WINDOW_MIN * MIN;
    const whatsappEnabled = isWhatsAppSendingEnabled();

    let sentCount = { confirm: 0, oneDay: 0, morning: 0, tenMin: 0, live: 0, skipped: 0 };
    console.log("CRON START", {
      now: now.toISOString(),
      windowMinutes: WINDOW_MIN,
      totalLeads: leads.length,
      whatsappEnabled,
    });

    if (!whatsappEnabled) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "WHATSAPP_SENDING_ENABLED=false",
        sentCount,
        totalLeads: leads.length,
      });
    }

    for (let i = 0; i < leads.length; i++) {
      const row = leads[i];
      const sheetRowNumber = i + 2; // because data starts at row 2

      const name = row[COL_NAME] || "";
      const phone10 = row[COL_PHONE] || "";
      const webinarDay = row[COL_WEBINAR_DAY] || "";
      const webinarDate = row[COL_WEBINAR_DATE] || "";
      const webinarTime = row[COL_WEBINAR_TIME] || "";
      const webinarISO = row[COL_WEBINAR_ISO] || "";

      const sentConfirm = String(row[COL_SENT_CONFIRM] || "no").toLowerCase();
      const sent1Day = String(row[COL_SENT_1DAY] || "no").toLowerCase();
      const sent10Min = String(row[COL_SENT_10MIN] || "no").toLowerCase();
      const sentLive = String(row[COL_SENT_LIVE] || "no").toLowerCase();
      const sentMorning = String(row[COL_SENT_MORNING] || "no").toLowerCase();

      // basic validations
      if (!phone10 || phone10.length !== 10) {
        console.log("SKIP invalid phone", { sheetRowNumber, phone10 });
        sentCount.skipped++;
        continue;
      }
      if (!webinarISO) {
        console.log("SKIP missing webinarISO", { sheetRowNumber });
        sentCount.skipped++;
        continue;
      }

      const webinarDT = new Date(webinarISO);
      if (!Number.isFinite(webinarDT.getTime())) {
        console.log("SKIP invalid webinarISO", { sheetRowNumber });
        sentCount.skipped++;
        continue;
      }

      const diffMs = webinarDT.getTime() - now.getTime();
      const diffMin = Math.round(diffMs / MIN);
      const reminderTimes = getWebinarReminderTimes(webinarDT);
      const isDue = (type, status) => {
        const elapsed = now.getTime() - reminderTimes[type];
        return status !== "yes" && status !== "skipped" && elapsed >= 0 && elapsed < WINDOW_MS;
      };

      // If confirmation already sent via API, but sheet still says "no"
      if (sentConfirm === "no") {
        await markCell(sheetRowNumber, LETTER_SENT_CONFIRM, "yes");
        sentCount.confirm++;
      }

      if (isDue("1day", sent1Day)) {
        await send1DayReminder({ name, phone10, webinarDate, webinarDay, webinarTime });
        await markCell(sheetRowNumber, LETTER_SENT_1DAY, "yes");
        sentCount.oneDay++;
        console.log("SEND 1DAY", { sheetRowNumber, diffMin, webinarISO });
        continue;
      }

      // Webinar-day 09:00 AM IST window
      if (isDue("morning", sentMorning)) {
        await sendMorningReminder({ name, phone10, webinarDate, webinarDay, webinarTime });
        await markCell(sheetRowNumber, LETTER_SENT_MORNING, "yes");
        sentCount.morning++;
        console.log("SEND MORNING", { sheetRowNumber, webinarISO });
        continue;
      }

      // 10-min window
      if (isDue("10min", sent10Min)) {
        await send10MinReminder({ name, phone10, webinarDate, webinarDay, webinarTime });
        await markCell(sheetRowNumber, LETTER_SENT_10MIN, "yes");
        sentCount.tenMin++;
        console.log("SEND 10MIN", { sheetRowNumber, diffMin, webinarISO });
        continue;
      }

      // Live window
      if (isDue("live", sentLive)) {
        await sendLiveNow({ name, phone10, webinarDate, webinarDay, webinarTime });
        await markCell(sheetRowNumber, LETTER_SENT_LIVE, "yes");
        sentCount.live++;
        console.log("SEND LIVE", { sheetRowNumber, diffMin, webinarISO });
        continue;
      }

      console.log("SKIP window", {
        sheetRowNumber,
        diffMin,
        webinarISO,
        sent1Day,
        sentMorning,
        sent10Min,
        sentLive,
      });
    }

    return NextResponse.json({ ok: true, sentCount, totalLeads: leads.length });
  } catch (error) {
    console.error("CRON Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
