import { getOwner } from "../../lib/store";
import { CONFIG } from "../../lib/config";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== CONFIG.ADMIN_KEY) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const o = await getOwner();
  const marginPerClick = CONFIG.NETWORK_RATE - CONFIG.USER_RATE;
  return Response.json({
    profit: o.profit,
    clicks: o.clicks,
    paidOut: o.paidOut,
    marginPerClick,
    netProfit: o.profit - o.paidOut,
  });
}
