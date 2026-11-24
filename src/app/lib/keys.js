export function normalizePrivateKey(value) {
  return String(value || "").split(String.fromCharCode(92) + "n").join(String.fromCharCode(10));
}
