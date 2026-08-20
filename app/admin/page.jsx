"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Admin() {
  const [key, setKey] = useState("");
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    const r = await fetch("/api/owner?key=" + encodeURIComponent(key));
    const j = await r.json();
    if (j.error) setErr(j.error);
    else setD(j);
  }

  return (
    <>
      <Nav />
      <section className="tool container">
        <h2>Owner Panel — Profit</h2>
        <div className="form-row" style={{ justifyContent: "center" }}>
          <div><label>Admin Key</label><input value={key} onChange={(e) => setKey(e.target.value)} placeholder="admin key" /></div>
          <div><label>&nbsp;</label><button className="btn" onClick={load}>Load Stats</button></div>
        </div>
        {err && <p className="muted" style={{ color: "#ff6b6b" }}>{err}</p>}

        {d && (
          <div className="wallet" style={{ marginTop: 24 }}>
            <div className="bal"><h3>Net Profit</h3><div className="amt">${(d.netProfit || 0).toFixed(2)}</div></div>
            <div className="bal" style={{ background: "linear-gradient(135deg,#00b894,#0984e3)" }}>
              <h3>Total Clicks</h3><div className="amt">{d.clicks}</div></div>
            <div className="bal" style={{ background: "linear-gradient(135deg,#e17055,#d63031)" }}>
              <h3>Profit / Click</h3><div className="amt">${(d.marginPerClick || 0).toFixed(2)}</div></div>
          </div>
        )}
        {d && (
          <p className="muted" style={{ marginTop: 12 }}>
            Paid out to users: ${(d.paidOut || 0).toFixed(2)} · Gross profit: ${(d.profit || 0).toFixed(2)}
          </p>
        )}
      </section>
      <Footer />
    </>
  );
}
