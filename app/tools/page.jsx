"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";

export default function Tools() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState(null);

  async function generate() {
    if (!url.trim()) return;
    setLoading(true);
    setOut(null);
    try {
      const r = await fetch("/api/shorten?url=" + encodeURIComponent(url.trim()));
      const d = await r.json();
      setOut(d);
    } catch (e) {
      setOut({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="tool">
        <h2>Shortlink Generator</h2>
        <p className="muted">API key stays hidden on the server. Paste any URL, get a monetized shrtfly link.</p>
        <input
          placeholder="https://example.com/your-offer"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate Link"}
        </button>

        {out && (
          <div className="result" style={{ display: "block" }}>
            {out.short ? (
              <div>
                ✅ <a href={out.short} target="_blank" rel="noreferrer">{out.short}</a>
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
                  Stats: <a href={out.stats} target="_blank" rel="noreferrer">{out.stats}</a>
                </div>
              </div>
            ) : (
              <span style={{ color: "#ff6b6b" }}>❌ {out.error || "failed"}</span>
            )}
          </div>
        )}
      </section>
    </AppShell>
  );
}
