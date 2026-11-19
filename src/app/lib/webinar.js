// src/app/lib/webinar.js
const IST_TIME_ZONE = "Asia/Kolkata";
const SUNDAY = 0;
const WEBINAR_UTC_HOUR = 5;
const WEBINAR_UTC_MINUTE = 30;
const MORNING_REMINDER_UTC_HOUR = 3;
const MORNING_REMINDER_UTC_MINUTE = 30;
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

function getIstDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

export function getNextWebinarDate(now = new Date()) {
  const current = getIstDateParts(now);
  const candidate = new Date(
    Date.UTC(current.year, current.month - 1, current.day, WEBINAR_UTC_HOUR, WEBINAR_UTC_MINUTE),
  );
  const daysUntilSunday = (SUNDAY - candidate.getUTCDay() + 7) % 7;
  candidate.setUTCDate(candidate.getUTCDate() + daysUntilSunday);
  if (candidate <= now) {
    candidate.setUTCDate(candidate.getUTCDate() + 7);
  }
  return candidate;
}

export function getWebinarReminderTimes(webinarDT) {
  const webinar = getIstDateParts(webinarDT);
  const start = webinarDT.getTime();
  const isSundayMorningWebinar =
    webinarDT.getUTCDay() === SUNDAY &&
    webinarDT.getUTCHours() === WEBINAR_UTC_HOUR &&
    webinarDT.getUTCMinutes() === WEBINAR_UTC_MINUTE;

  return {
    // Sunday 11 AM minus 15 hours is Saturday 8 PM. Preserve older bookings' timing.
    "1day": start - (isSundayMorningWebinar ? 15 : 24) * HOUR_MS,
    morning: Date.UTC(
      webinar.year,
      webinar.month - 1,
      webinar.day,
      MORNING_REMINDER_UTC_HOUR,
      MORNING_REMINDER_UTC_MINUTE,
    ),
    "10min": start - 10 * MINUTE_MS,
    live: start,
  };
}

export function formatWebinarParts(webinarDT) {
  const webinarDay = webinarDT.toLocaleDateString("en-IN", {
    timeZone: IST_TIME_ZONE,
    weekday: "long",
  });

  const webinarDate = webinarDT.toLocaleDateString("en-IN", {
    timeZone: IST_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const webinarTime = webinarDT.toLocaleTimeString("en-IN", {
    timeZone: IST_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { webinarDay, webinarDate, webinarTime };
}
