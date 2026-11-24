import { cleanPhone10 } from "./phone";

// Shared by the browser and API so field rules and messages stay consistent.
export function getRegistrationErrors(body, { requireConsent = true } = {}) {
  const errors = {};
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  if (name.length < 2 || name.length > 100) errors.name = "Enter your full name (2–100 characters).";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email, e.g. rahul@gmail.com.";
  try {
    if (!phone || /[^\d\s()+.\-]/.test(phone)) throw new Error("Invalid phone");
    if (!/^[6-9]\d{9}$/.test(cleanPhone10(phone))) throw new Error("Invalid phone");
  } catch {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }
  if (requireConsent && body?.whatsappConsent !== true) errors.whatsappConsent = "Please agree to receive workshop details and reminders.";
  return errors;
}

export function validateForm(body, { requireConsent = false } = {}) {
  const fieldErrors = getRegistrationErrors(body, { requireConsent });
  if (Object.keys(fieldErrors).length) {
    const error = new Error("Please check the highlighted fields.");
    error.fieldErrors = fieldErrors;
    throw error;
  }
  return { ...body, name: body.name.trim(), email: body.email.trim().toLowerCase(), phone: cleanPhone10(body.phone), whatsappConsent: body.whatsappConsent === true };
}
