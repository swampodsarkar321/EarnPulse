export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const apiKey = process.env.SHRTFLY_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "SHRTFLY_API_KEY not configured" }, { status: 500 });
  }
  if (!url) {
    return Response.json({ error: "Missing ?url= parameter" }, { status: 400 });
  }

  const apiUrl =
    "https://shrtfly.com/api?api=" +
    encodeURIComponent(apiKey) +
    "&url=" +
    encodeURIComponent(url) +
    "&type=1&format=json";

  try {
    const r = await fetch(apiUrl);
    const data = await r.json();

    if (data.status === "success" && data.result && data.result.shorten_url) {
      return Response.json({
        short: data.result.shorten_url,
        stats: data.result.stats_url,
      });
    }
    return Response.json({ error: data.result || "shrtfly error" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
