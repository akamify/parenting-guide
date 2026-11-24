const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const webinarModule = import(
  `data:text/javascript;base64,${readFileSync(`${__dirname}/src/app/lib/webinar.js`).toString("base64")}`
);

test("registrations select the upcoming Sunday at 11 AM IST, including Sunday morning", async () => {
  const { getNextWebinarDate } = await webinarModule;
  for (const registeredAt of [
    "2026-11-24T12:00:00+05:30",
    "2026-11-28T21:00:00+05:30",
    "2026-11-29T10:59:59+05:30",
  ]) {
    assert.equal(getNextWebinarDate(new Date(registeredAt)).toISOString(), "2026-11-29T05:30:00.000Z");
  }
});

test("registration at or after webinar start selects next Sunday", async () => {
  const { getNextWebinarDate } = await webinarModule;
  for (const time of ["11:00:00", "18:00:00"]) {
    assert.equal(
      getNextWebinarDate(new Date(`2026-11-29T${time}+05:30`)).toISOString(),
      "2026-12-06T05:30:00.000Z",
    );
  }
});

test("reminders are Saturday 8 PM and Sunday 9 AM, 10:50 AM, 11 AM IST", async () => {
  const { getWebinarReminderTimes } = await webinarModule;
  const times = getWebinarReminderTimes(new Date("2026-11-29T11:00:00+05:30"));
  const expected = {
    "1day": "2026-11-28T20:00:00+05:30",
    morning: "2026-11-29T09:00:00+05:30",
    "10min": "2026-11-29T10:50:00+05:30",
    live: "2026-11-29T11:00:00+05:30",
  };
  for (const [type, time] of Object.entries(expected)) {
    assert.equal(times[type], new Date(time).getTime());
  }
});

test("late registrations keep only future reminders, including exact cutoff times", async () => {
  const { getUpcomingWebinarReminders } = await webinarModule;
  const webinar = new Date("2026-11-29T11:00:00+05:30");
  const cases = [
    ["2026-11-28T19:59:59+05:30", ["1day", "morning", "10min", "live"]],
    ["2026-11-28T20:00:00+05:30", ["morning", "10min", "live"]],
    ["2026-11-29T09:00:00+05:30", ["10min", "live"]],
    ["2026-11-29T10:50:00+05:30", ["live"]],
    ["2026-11-29T11:00:00+05:30", []],
  ];
  for (const [registeredAt, expected] of cases) {
    assert.deepEqual(
      getUpcomingWebinarReminders(webinar, new Date(registeredAt)).map(([type]) => type),
      expected,
    );
  }
});
