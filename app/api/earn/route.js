import { cookies } from "next/headers";
import { createTask, cooldownOk, getDailyCount } from "../../lib/store";
import { CONFIG } from "../../lib/config";
import { AD_LINKS } from "../../lib/links";

export const dynamic = "force-dynamic";

function adUrlFor(adId) {
  const idx = adId ? parseInt(String(adId).replace(/\D/g, ""), 10) - 1 : -1;
  if (idx >= 0 && AD_LINKS[idx]) return AD_LINKS[idx];
  return AD_LINKS[Math.floor(Date.now() / 1000) % AD_LINKS.length];
}

export async function POST(req) {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ error: "not logged in" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const adId = body.adId || null;
  const date = new Date().toISOString().slice(0, 10);

  if (!(await cooldownOk(name)))
    return Response.json({ error: "wait", wait: CONFIG.COOLDOWN_MS / 1000 }, { status: 429 });

  // per-ad daily limit (server-enforced)
  if (adId) {
    const c = await getDailyCount(name, adId, date);
    if (c >= CONFIG.AD_DAILY_LIMIT)
      return Response.json(
        { error: "daily_limit", msg: `Daily limit reached for this ad (${CONFIG.AD_DAILY_LIMIT}/day).` },
        { status: 429 }
      );
  }

  // owner keeps OWNER_SHARE, user gets USER_SHARE of the network payout.
  // owner profit per click = USER_RATE * (OWNER_SHARE / USER_SHARE)
  const profit = CONFIG.USER_RATE * (CONFIG.OWNER_SHARE / CONFIG.USER_SHARE);
  const token = await createTask(name, CONFIG.USER_RATE, profit, adId);

  // Basic shrtfly shortener has no postback, so we open a real shortlink ad and
  // rely on the client wait+claim flow for verification.
  const adUrl = adUrlFor(adId);

  return Response.json({
    ok: true,
    token,
    adUrl,
    adId,
    wait: CONFIG.WAIT_MS,
    dailyLeft: CONFIG.AD_DAILY_LIMIT - (adId ? await getDailyCount(name, adId, date) : 0),
  });
}
