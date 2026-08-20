"use client";
import { useState } from "react";
import { fmtMoney } from "../lib/config";

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
    <section className="tool" style={{ marginTop: 10 }}>
      <div className="section-head" style={{ textAlign: "center" }}>
        <span className="eyebrow">Owner</span>
        <h2>Profit Dashboard</h2>
      </div>

      <div className="card">
        <div className="field">
          <label>Admin key</label>
          <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="enter admin key" type="password" />
        </div>
        <button className="btn btn-block" onClick={load}>Load stats</button>
        {err && <p style={{ color: "var(--red)", fontSize: 13.5, marginTop: 12 }}>{err}</p>}
      </div>

      {d && (
        <>
          <div className="stats" style={{ marginTop: 18 }}>
            <div className="stat accent">
              <div className="k">Net profit</div>
              <div className="v">${fmtMoney(d.netProfit || 0)}</div>
            </div>
            <div className="stat green">
              <div className="k">Total clicks</div>
              <div className="v">{d.clicks}</div>
            </div>
          </div>
          <div className="card">
            <ul className="list">
              <li><span>Profit / click</span><span className="rec-amt">${fmtMoney(d.marginPerClick || 0)}</span></li>
              <li><span>Gross profit</span><span className="rec-amt">${fmtMoney(d.profit || 0)}</span></li>
              <li><span>Paid out to users</span><span className="rec-amt minus">${fmtMoney(d.paidOut || 0)}</span></li>
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
