import { creditTask } from "../../../lib/store";

export const dynamic = "force-dynamic";

// shrtfly postback endpoint. Configure this URL in the shrtfly dashboard
// (Tools -> Postback URL), e.g.:
//   https://earn-pulse-d4hk.vercel.app/api/shrtfly-callback?sub={sub}
// shrtfly fires it when the shortlink (carrying our task token as `sub`) is
// visited, so the user is only credited after a REAL ad view.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sub = searchParams.get("sub") || searchParams.get("sid") ||
    searchParams.get("click_id") || searchParams.get("transaction_id");
  if (sub) await creditTask(sub);
  return new Response("ok", { status: 200 });
}
