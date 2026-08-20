import { cookies } from "next/headers";
import { addEarning } from "../../lib/store";
import { CONFIG } from "../../lib/config";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ error: "not logged in" }, { status: 401 });

  // owner earns NETWORK_RATE, user gets USER_RATE, margin stays with owner
  const profit = CONFIG.NETWORK_RATE - CONFIG.USER_RATE;
  const balance = await addEarning(name, CONFIG.USER_RATE, profit);
  if (balance === null) return Response.json({ error: "user not found" }, { status: 404 });

  return Response.json({
    ok: true,
    balance,
    earned: CONFIG.USER_RATE,
    ownerProfit: profit,
  });
}
