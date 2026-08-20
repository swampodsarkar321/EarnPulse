import { db } from "../../lib/firebase";
import { ref, get } from "firebase/database";

export const dynamic = "force-dynamic";

export async function GET() {
  const snap = await get(ref(db, "users"));
  if (!snap.exists()) return Response.json({ list: [] });
  const users = snap.val();
  const list = Object.entries(users)
    .map(([name, u]) => ({ name, balance: Number(u.balance || 0) }))
    .filter((u) => u.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 10);
  return Response.json({ list });
}
