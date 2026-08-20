"use client";
import { useState } from "react";

export default function EarnButton({ label, adUrl }) {
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState(null);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(0);
  const [canClaim, setCanClaim] = useState(false);

  async function start() {
    if (busy || token) return;
    setBusy(true);
    setMsg("");
    const r = await fetch("/api/earn", { method: "POST" });
    const d = await r.json();
    if (!d.ok) {
      if (d.error === "wait") setMsg(`⏳ Wait ${Math.ceil(d.wait)}s before next ad`);
      else setMsg("❌ " + (d.error || "login required"));
      setBusy(false);
      return;
    }
    const open = d.adUrl || adUrl;
    if (open) window.open(open, "_blank", "noopener");
    setToken(d.token);

    let left = Math.ceil(d.wait / 1000);
    setCount(left);
    setCanClaim(false);
    const iv = setInterval(() => {
      left -= 1;
      setCount(left);
      if (left <= 0) {
        clearInterval(iv);
        setCanClaim(true);
      }
    }, 1000);
    setBusy(false);
  }

  async function claim() {
    if (!token || !canClaim) return;
    setBusy(true);
    const r = await fetch("/api/earn/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const d = await r.json();
    if (d.ok)
      setMsg(`✅ +$${d.earned.toFixed(2)}  |  Balance $${d.balance.toFixed(2)}`);
    else setMsg("❌ " + (d.error || "failed"));
    setToken(null);
    setCanClaim(false);
    setCount(0);
    setBusy(false);
  }

  return (
    <>
      <button className="btn btn-block" onClick={start} disabled={busy || !!token}>
        {label}
      </button>
      {token && (
        <button
          className="btn btn-green btn-block"
          onClick={claim}
          disabled={!canClaim || busy}
          style={{ marginTop: 8 }}
        >
          {canClaim ? "Claim $0.01" : `Wait ${count}s...`}
        </button>
      )}
      {msg && <p className="hint" style={{ marginTop: 8, textAlign: "center" }}>{msg}</p>}
    </>
  );
}
