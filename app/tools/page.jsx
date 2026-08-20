"use client";
import { useState } from "react";

export default function Tools() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!url.trim()) return;
    setLoading(true);
    setOut(null);
    setCopied(false);
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

  async function copy() {
    if (!out?.short) return;
    try {
      await navigator.clipboard.writeText(out.short);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <section className="tool" style={{ marginTop: 10 }}>
      <div className="section-head" style={{ textAlign: "center" }}>
        <span className="eyebrow">Tools</span>
        <h2>Shortlink Generator</h2>
        <p className="muted">The API key stays hidden on the server. Paste any URL to get a monetized shrtfly link.</p>
      </div>

      <div className="card">
        <div className="field">
          <label>URL to shorten</label>
          <input
            placeholder="https://example.com/your-offer"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
        </div>
        <button className="btn btn-block" onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "Generate link"}
        </button>

        {out && (
          <div className="field" style={{ marginTop: 16, marginBottom: 0 }}>
            {out.short ? (
              <>
                <label>Monetized link</label>
                <div className="row-between" style={{ gap: 8 }}>
                  <a href={out.short} target="_blank" rel="noreferrer" className="link" style={{ wordBreak: "break-all" }}>{out.short}</a>
                  <button className="btn btn-sm btn-soft" onClick={copy} style={{ flexShrink: 0 }}>{copied ? "Copied" : "Copy"}</button>
                </div>
                <p className="hint" style={{ marginTop: 10 }}>
                  Stats: <a href={out.stats} target="_blank" rel="noreferrer" className="link">view analytics</a>
                </p>
              </>
            ) : (
              <p style={{ color: "var(--red)", fontSize: 13.5 }}>❌ {out.error || "failed"}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
