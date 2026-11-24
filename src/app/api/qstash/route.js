// src/app/api/qstash/route.js
import { NextResponse } from "next/server";
import { verifyQstashRequest } from "../../lib/qstash";
import { findRowByLeadId, LEAD_STATUS_COLUMNS, markCell } from "../../lib/googleSheet";
import {
  isWhatsAppSendingEnabled,
  send1DayReminder,
  sendMorningReminder,
  send10MinReminder,
  sendLiveNow,
} from "../../lib/waspakamify";

const REMINDER_SENDERS = {
  "1day": send1DayReminder,
  morning: sendMorningReminder,
  "10min": send10MinReminder,
  live: sendLiveNow,
};

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("upstash-signature") || "";

    const isValid = await verifyQstashRequest({ body, signature, reqUrl: req.url });
    if (!isValid) {
      return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body || "{}");
    const {
      type,
      rowNumber,
      leadId,
      name,
      phone10,
      webinarDate,
      webinarDay,
      webinarTime,
    } = data;

    if (!type) {
      return NextResponse.json({ ok: false, message: "Missing payload fields" }, { status: 400 });
    }

    const targetRow = leadId ? await findRowByLeadId(leadId) : rowNumber;
    if (!targetRow) {
      return NextResponse.json({ ok: false, message: "Row not found" }, { status: 404 });
    }

    console.log("QSTASH RECEIVED", { type, rowNumber: targetRow, leadId, phone10, webinarDate, webinarDay, webinarTime });

    if (!isWhatsAppSendingEnabled()) {
      if (Object.hasOwn(REMINDER_SENDERS, type)) {
        await markCell(targetRow, LEAD_STATUS_COLUMNS[type], "disabled");
      }
      console.log("QSTASH WHATSAPP SKIPPED", {
        type,
        rowNumber: targetRow,
        reason: "WHATSAPP_SENDING_ENABLED=false",
      });
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (!Object.hasOwn(REMINDER_SENDERS, type)) {
      return NextResponse.json({ ok: false, message: "Unknown job type" }, { status: 400 });
    }

    await REMINDER_SENDERS[type]({ name, phone10, webinarDate, webinarDay, webinarTime });
    await markCell(targetRow, LEAD_STATUS_COLUMNS[type], "yes");
    console.log("QSTASH SENT", { type, rowNumber: targetRow });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("QStash Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
