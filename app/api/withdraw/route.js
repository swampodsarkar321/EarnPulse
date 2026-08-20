import { cookies } from "next/headers";
import { addWithdrawal } from "../../../lib/store";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ error: "not logged in" }, { status: 401 });

  const { method, amount } = await req.json();
  const amt = Number(amount);
  if (!amt || amt <= 0) return Response.json({ error: "Enter a valid amount" }, { status: 400 });
  if (amt < 0.01) return Response.json({ error: "Minimum withdrawal is $0.01" }, { status: 400 });

  const res = await addWithdrawal(name, method, amt);
  if (res.error) return Response.json({ error: res.error }, { status: 400 });
  return Response.json({ ok: true, balance: res.balance });
}
