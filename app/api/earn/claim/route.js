import { cookies } from "next/headers";
import { creditTask } from "../../../../lib/store";

export const dynamic = "force-dynamic";

// Fallback claim (used if shrtfly postback is slow/unconfigured). The user must
// have waited (enforced client-side) and the token must be valid + unclaimed.
export async function POST(req) {
  const name = cookies().get("ep_user")?.value;
  if (!name) return Response.json({ error: "not logged in" }, { status: 401 });

  const { token } = await req.json();
  if (!token) return Response.json({ error: "token required" }, { status: 400 });

  const res = await creditTask(token);
  if (res.error) return Response.json({ error: res.error }, { status: 400 });

  return Response.json(res);
}
