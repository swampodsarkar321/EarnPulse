"use client";
import { useState } from "react";

export default function EarnButton({ label }) {
  const [msg, setMsg] = useState("");
  async function click() {
    const r = await fetch("/api/earn", { method: "POST" });
    const d = await r.json();
    if (d.ok)
      setMsg(`✅ +$${d.earned.toFixed(2)}  |  Balance $${d.balance.toFixed(2)}`);
    else setMsg("❌ " + (d.error || "login required"));
  }
  return (
    <>
      <button className="earn-btn" onClick={click} style={{ border: "none", width: "100%", cursor: "pointer" }}>
        {label}
      </button>
      {msg && <p className="muted" style={{ marginTop: 8 }}>{msg}</p>}
    </>
  );
}
