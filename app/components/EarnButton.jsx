"use client";
import { useState } from "react";

export default function EarnButton({ label, adUrl }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function click() {
    if (busy) return;
    setBusy(true);

    // Open the real shrtfly full-page ad in a new tab (you earn from it)
    if (adUrl) window.open(adUrl, "_blank", "noopener");

    // Credit the user (ad is shown)
    const r = await fetch("/api/earn", { method: "POST" });
    const d = await r.json();
    if (d.ok)
      setMsg(`✅ +$${d.earned.toFixed(2)}  |  Balance $${d.balance.toFixed(2)}`);
    else setMsg("❌ " + (d.error || "login required"));
    setBusy(false);
  }

  return (
    <>
      <button
        className="earn-btn"
        onClick={click}
        disabled={busy}
        style={{ border: "none", width: "100%", cursor: "pointer" }}
      >
        {label}
      </button>
      {msg && <p className="muted" style={{ marginTop: 8 }}>{msg}</p>}
    </>
  );
}
