import { NextResponse } from "next/server";
import { creditFromNetwork, tidSeen, markTid } from "../../lib/store";
import { CONFIG } from "../../lib/config";

// CPAlead postback endpoint. Configure this URL in the CPAlead dashboard:
//   https://earn-pulse-d4hk.vercel.app/api/cpalead-postback?payout=#payout#&sub=#sub#&tid=#tid#&key=YOUR_SECRET
//   (replace YOUR_SECRET with the value of CPALEAD_POSTBACK_SECRET)
export async function GET(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const tid = url.searchParams.get("tid");
  const sub = url.searchParams.get("sub");
  const payout = parseFloat(url.searchParams.get("payout"));

  if (key !== CONFIG.CPALEAD_POSTBACK_SECRET) {
    return new NextResponse("0", { status: 403 });
  }
  if (!tid || !sub || isNaN(payout) || payout <= 0) {
    return new NextResponse("0", { status: 400 });
  }
  // Acknowledge but ignore absurd payouts (abuse guard).
  if (payout > CONFIG.CPALEAD_MAX_PAYOUT) {
    return new NextResponse("1");
  }
  // Dedupe: CPAlead may retry; only credit once per transaction.
  if (await tidSeen(tid)) {
    return new NextResponse("1");
  }

  const res = await creditFromNetwork(sub, payout, { type: "cpalead", detail: tid });
  await markTid(tid, { name: sub, payout });
  return new NextResponse("1");
}
