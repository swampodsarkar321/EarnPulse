import { cookies } from "next/headers";
import { getUser } from "../../lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ loggedIn: false });
  const u = await getUser(name);
  if (!u) return Response.json({ loggedIn: false });

  // recent history (last 6), newest first
  let recent = [];
  if (u.history) {
    recent = Object.values(u.history)
      .sort((a, b) => b.at - a.at)
      .slice(0, 6)
      .map((h) => ({ amount: h.amount, at: h.at }));
  }

  return Response.json({
    loggedIn: true,
    name,
    balance: u.balance || 0,
    recent,
  });
}
