import { cookies } from "next/headers";
import { createTask, cooldownOk } from "../../lib/store";
import { createShortlink } from "../../lib/shrtfly";
import { CONFIG } from "../../lib/config";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ error: "not logged in" }, { status: 401 });

  if (!(await cooldownOk(name)))
    return Response.json({ error: "wait", wait: CONFIG.COOLDOWN_MS / 1000 }, { status: 429 });

  // owner earns NETWORK_RATE, user gets USER_RATE, margin stays with owner
  const profit = CONFIG.NETWORK_RATE - CONFIG.USER_RATE;
  const token = await createTask(name, CONFIG.USER_RATE, profit);

  // Create a shrtfly shortlink that carries this token as `sub` so shrtfly's
  // postback (configured in their dashboard) reports it back for verification.
  const adUrl = await createShortlink(CONFIG.AD_DESTINATION, token);

  return Response.json({ ok: true, token, adUrl: adUrl || "", wait: CONFIG.WAIT_MS });
}
