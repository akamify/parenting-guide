export function safeExternalUrl(value) {
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : ""; } catch { return ""; }
}
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
export function readRegistration(storage, now = Date.now()) {
  try {
    const saved = storage.getItem("thankyouData");
    if (!saved) return null;
    const data = JSON.parse(saved);
    const created = Date.parse(data?.timestamp);
    if (!data || typeof data.name !== "string" || typeof data.email !== "string" || !/^\d{10}$/.test(data.phone) || !Number.isFinite(created) || created > now + 60_000 || now - created >= 3_600_000) {
      storage.removeItem("thankyouData"); return null;
    }
    return data;
  } catch { return null; }
}
