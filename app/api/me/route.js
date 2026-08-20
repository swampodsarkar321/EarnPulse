import { cookies } from "next/headers";
import { getUser } from "../../lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ loggedIn: false });
  const u = await getUser(name);
  if (!u) return Response.json({ loggedIn: false });
  return Response.json({ loggedIn: true, name, balance: u.balance || 0 });
}
