const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const phoneUrl = moduleUrl(readFileSync(`${__dirname}/src/app/lib/phone.js`, "utf8"));
const registration = import(moduleUrl(
  readFileSync(`${__dirname}/src/app/lib/validate.js`, "utf8").replace('"./phone"', JSON.stringify(phoneUrl)),
));
const valid = { name: "Rahul Singh", email: "rahul@example.com", phone: "9876543210", whatsappConsent: true };

test("empty and malformed requests return field errors without type crashes", async () => {
  const { getRegistrationErrors, validateForm } = await registration;
  for (const body of [null, {}, { name: {}, email: [], phone: 9876543210 }]) {
    assert.deepEqual(Object.keys(getRegistrationErrors(body)), ["name", "email", "phone", "whatsappConsent"]);
    assert.throws(() => validateForm(body), error => !!error.fieldErrors);
  }
});

test("normalizes spaces, email case, and pasted Indian phone numbers", async () => {
  const { validateForm } = await registration;
  for (const phone of ["9876543210", "+91 98765 43210", "09876543210", "+91 (98765) 43210"]) {
    const result = validateForm({ ...valid, name: "  राहुल सिंह  ", email: "  RAHUL@Example.COM ", phone });
    assert.equal(result.name, "राहुल सिंह");
    assert.equal(result.email, "rahul@example.com");
    assert.equal(result.phone, "9876543210");
    assert.equal(result.whatsappConsent, true);
  }
});

test("rejects bad mobile numbers, letters, international numbers, and invalid email", async () => {
  const { getRegistrationErrors } = await registration;
  for (const phone of ["1234567890", "987654321", "98765432101", "abc9876543210", "+44 7700 900123"]) {
    assert.ok(getRegistrationErrors({ ...valid, phone }).phone, phone);
  }
  for (const email of ["rahul@", "a@@example.com", "a b@example.com", "x".repeat(255)]) {
    assert.ok(getRegistrationErrors({ ...valid, email }).email, email);
  }
});

test("requires explicit consent and supports Unicode names", async () => {
  const { getRegistrationErrors, validateForm } = await registration;
  for (const whatsappConsent of [undefined, false, "true", 1]) {
    assert.ok(getRegistrationErrors({ ...valid, whatsappConsent }).whatsappConsent);
    assert.throws(() => validateForm({ ...valid, whatsappConsent }, { requireConsent: true }));
  }
  assert.deepEqual(getRegistrationErrors({ ...valid, name: "अनिता शर्मा" }), {});
  assert.ok(getRegistrationErrors({ ...valid, name: " " }).name);
});

test("existing course checkout validation does not require webinar consent", async () => {
  const { validateForm } = await registration;
  const { whatsappConsent, ...courseLead } = valid;
  assert.equal(validateForm(courseLead).whatsappConsent, false);
});
