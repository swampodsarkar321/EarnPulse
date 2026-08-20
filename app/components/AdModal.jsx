"use client";
import { useState } from "react";
import { fmtMoney } from "../lib/config";

export default function AdModal({ ad }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("loading"); // loading|viewing|done|success|error
  const [token, setToken] = useState(null);
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("");

  function close() {
    setOpen(false);
    setStage("loading");
    setToken(null);
  }

  async function start() {
    setOpen(true);
    setStage("loading");
    setMsg("");
    const r = await fetch("/api/earn", { method: "POST" });
    const d = await r.json();
    if (!d.ok) {
      setStage("error");
      setMsg(d.error === "wait" ? `Please wait ${Math.ceil(d.wait)}s between ads.` : "Please log in to earn.");
      return;
    }
    const openUrl = d.adUrl || ad.adUrl;
    if (openUrl) window.open(openUrl, "_blank", "noopener");
    setToken(d.token);

    let left = Math.ceil((d.wait || 12));
    setCount(left);
    setStage("viewing");
    const iv = setInterval(() => {
      left -= 1;
      setCount(left);
      if (left <= 0) {
        clearInterval(iv);
        setStage("done");
      }
    }, 1000);
  }

  async function claim() {
    const r = await fetch("/api/earn/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const d = await r.json();
    if (d.ok) setMsg(`Reward claimed! Balance: $${fmtMoney(d.balance)}`);
    else setMsg(d.error || "Could not claim");
    setStage("success");
  }

  return (
    <>
      <button className="ad-watch" onClick={start}>▶ Watch</button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={close} aria-label="Close">×</button>
            <div className="modal-head">
              <div className="ad-thumb">{ad.icon || "🎬"}</div>
              <div className="ad-info">
                <b>{ad.title}</b>
                <span className="muted">{ad.advertiser}</span>
              </div>
              <div className="ad-reward">+${fmtMoney(ad.amount)}</div>
            </div>

            <div className="view-frame">
              {stage === "loading" && <p className="muted">Preparing your ad…</p>}

              {stage === "viewing" && (
                <>
                  <div className="spinner" />
                  <p>The ad opened in a <b>new tab</b>. Please view it.</p>
                  <p className="muted small">Reward unlocks in <b>{count}s</b> — keep this tab open.</p>
                </>
              )}

              {stage === "done" && (
                <p className="ok">✅ Ad viewed! Claim your reward below.</p>
              )}

              {stage === "error" && <p className="err">⚠️ {msg}</p>}
              {stage === "success" && <p className="ok">✅ {msg}</p>}
            </div>

            {stage === "viewing" && (
              <button className="btn" disabled>Please wait {count}s…</button>
            )}
            {stage === "done" && (
              <button className="btn" onClick={claim}>Claim +${fmtMoney(ad.amount)}</button>
            )}
            {stage === "success" && (
              <button className="btn btn-ghost" onClick={close}>Close</button>
            )}
            {stage === "error" && (
              <a href="/login" className="btn">Login to earn</a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
