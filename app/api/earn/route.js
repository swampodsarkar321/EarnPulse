import { cookies } from "next/headers";
import { createTask, cooldownOk } from "../../lib/store";
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

  return Response.json({ ok: true, token, wait: CONFIG.WAIT_MS });
}
