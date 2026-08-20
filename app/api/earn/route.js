import { cookies } from "next/headers";
import { createTask, cooldownOk } from "../../lib/store";
import { CONFIG } from "../../lib/config";
import { AD_LINKS } from "../../lib/links";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ error: "not logged in" }, { status: 401 });

  if (!(await cooldownOk(name)))
    return Response.json({ error: "wait", wait: CONFIG.COOLDOWN_MS / 1000 }, { status: 429 });

  // owner earns NETWORK_RATE, user gets USER_RATE, margin stays with owner
  const profit = CONFIG.NETWORK_RATE - CONFIG.USER_RATE;
  const token = await createTask(name, CONFIG.USER_RATE, profit);

  // Basic shrtfly shortener has no postback, so we open a real shortlink ad and
  // rely on the client wait+claim flow for verification.
  const adUrl = AD_LINKS[Math.floor(Date.now() / 1000) % AD_LINKS.length];

  return Response.json({ ok: true, token, adUrl, wait: CONFIG.WAIT_MS });
}
