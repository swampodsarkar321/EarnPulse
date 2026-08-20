import { cookies } from "next/headers";
import { createUser, verify } from "../../lib/store";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let { action, name, pass } = await req.json();
  name = (name || "").trim();
  if (!name || !pass) return Response.json({ error: "name & password required" }, { status: 400 });

  if (action === "signup") {
    const ok = createUser(name, pass);
    if (!ok) return Response.json({ error: "username taken" }, { status: 409 });
  } else if (action === "login") {
    if (!verify(name, pass)) return Response.json({ error: "invalid credentials" }, { status: 401 });
  } else {
    return Response.json({ error: "unknown action" }, { status: 400 });
  }

  cookies().set("ep_user", name, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
  return Response.json({ ok: true, name });
}
