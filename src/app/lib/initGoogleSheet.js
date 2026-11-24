import { normalizePrivateKey } from "./keys.js";
import { google } from "googleapis";
import dotenv from "dotenv";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
dotenv.config({ path: ".env.local" });
dotenv.config();
const headers = ["Timestamp UTC", "Name", "Email", "Phone", "Source", "Webinar Day", "Webinar Date", "Webinar Time", "Webinar ISO", "Confirmation Accepted", "Saturday Reminder Accepted", "Morning Reminder Accepted", "10 Minute Reminder Accepted", "Live Reminder Accepted", "Lead ID", "WhatsApp Consent", "Consent Timestamp UTC"];
export async function initSheetHeaders() {
  for (const name of ["GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"]) if (!process.env[name]) throw new Error(`${name} is required`);
  const auth = new google.auth.JWT({ email: process.env.GOOGLE_CLIENT_EMAIL, key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY), scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.update({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range: "Sheet1!A1:Q1", valueInputOption: "RAW", requestBody: { values: [headers] } });
  console.log("Sheet1 headers updated.");
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) initSheetHeaders().catch(() => { console.error("Could not initialize sheet headers. Check credentials and permissions."); process.exitCode = 1; });
