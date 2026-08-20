// Server-side helper to create a shrtfly shortlink carrying our task token as
// the `sub` id, so shrtfly's postback can report it back to us for verification.
const KEY = process.env.SHRTFLY_API_KEY;

export async function createShortlink(dest, sub) {
  if (!KEY) return null;
  const url =
    "https://shrtfly.com/api?api=" +
    encodeURIComponent(KEY) +
    "&url=" +
    encodeURIComponent(dest) +
    "&sub=" +
    encodeURIComponent(sub) +
    "&type=1&format=json";
  try {
    const r = await fetch(url, { cache: "no-store" });
    const j = await r.json();
    if (j && j.status === "success" && j.result && j.result.shorten_url)
      return j.result.shorten_url;
  } catch (e) {
    // ignore; caller falls back to a static link
  }
  return null;
}
