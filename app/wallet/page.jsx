"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fmtMoney, CONFIG } from "../lib/config";

function ago(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return s + "s ago";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export default function Wallet() {
  const [me, setMe] = useState(null);
  const [method, setMethod] = useState("bKash");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    const r = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, amount: Number(amount) }),
    });
    const d = await r.json();
    if (d.ok) {
      setMsg(`Request submitted. New balance: $${fmtMoney(d.balance)}`);
      setAmount("");
      fetch("/api/me").then((r) => r.json()).then(setMe);
    } else setErr(d.error);
  }

  return (
    <>
      <Nav />
      <section className="dash container">
        {!me && <p className="muted">Loading...</p>}

        {me && !me.loggedIn && (
          <div className="tool">
            <h2>Please login</h2>
            <p className="muted">You must be logged in to view your wallet.</p>
            <a href="/login" className="btn">Login</a>
          </div>
        )}

        {me && me.loggedIn && (
          <>
            <div className="wallet">
              <div className="bal">
                <h3>Your Balance</h3>
                <div className="amt">${fmtMoney(me.balance)}</div>
                <p style={{ opacity: .85, fontSize: 13 }}>Welcome, {me.name}</p>
              </div>
              <div className="bal" style={{ background: "linear-gradient(135deg,#00b894,#0984e3)" }}>
                <h3>Earn Per Click</h3>
                <div className="amt">${fmtMoney(CONFIG.USER_RATE)}</div>
                <p style={{ opacity: .85, fontSize: 13 }}>Watch &amp; earn</p>
              </div>
            </div>

            <div className="panel">
              <h3>Request Withdrawal</h3>
              <form className="form-row" onSubmit={submit}>
                <div>
                  <label>Method</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option>bKash</option>
                    <option>Nagad</option>
                    <option>USDT</option>
                    <option>PayPal</option>
                    <option>Binance</option>
                  </select>
                </div>
                <div>
                  <label>Amount ($)</label>
                  <input type="number" step="0.0001" min="0.01" placeholder="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div>
                  <label>&nbsp;</label>
                  <button className="btn" type="submit">Request Payout</button>
                </div>
              </form>
              {err && <p style={{ color: "#ff6b6b", marginTop: 12 }}>{err}</p>}
              {msg && <p style={{ color: "var(--green)", marginTop: 12 }}>{msg}</p>}
              <p className="muted" style={{ textAlign: "left", marginTop: 12 }}>
                Payouts are processed manually by the admin from network earnings. Funds are reserved when you request.
              </p>
            </div>

            <div className="panel">
              <h3>Withdrawal History</h3>
              {me.withdrawals && me.withdrawals.length > 0 ? (
                <ul className="recent">
                  {me.withdrawals.map((w, i) => (
                    <li key={i}>
                      <span>💸 {w.method}</span>
                      <span className="rec-amt">-${fmtMoney(w.amount)}</span>
                      <span className="muted">{ago(w.at)} · {w.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No withdrawals yet.</p>
              )}
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
