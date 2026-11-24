import { NextResponse } from "next/server";
import { verifyQstashRequest } from "../../lib/qstash";
import { findRowByLeadId } from "../../lib/googleSheet";
import { deliverReminder, reminderTypes } from "../../lib/reminders";
import { readLimitedText } from "../../lib/requestGuard";

export async function POST(req) {
  try {
    const signature = req.headers.get("upstash-signature");
    if (!signature) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    const body = await readLimitedText(req);
    if (!await verifyQstashRequest({ body, signature, reqUrl: req.url })) return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
    const data = JSON.parse(body);
    if (!reminderTypes.includes(data?.type) || typeof data?.leadId !== "string") return NextResponse.json({ ok: false, message: "Invalid reminder" }, { status: 400 });
    const rowNumber = await findRowByLeadId(data.leadId);
    if (!rowNumber) return NextResponse.json({ ok: true, skipped: true });
    const result = await deliverReminder(rowNumber, data.type, data.leadId);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false }, { status: 400 });
    console.error("Reminder processing failed");
    return NextResponse.json({ ok: false, message: "Reminder processing failed" }, { status: error.status || 500 });
  }
}
