"use client";
import { useState } from "react";
import { useApp } from "../components/AppShell";
import { useToast } from "../components/AppShell";
import { fmtMoney, CONFIG } from "../lib/config";

const METHODS = [
  { id: "bKash", ic: "📱" },
  { id: "Nagad", ic: "💳" },
  { id: "USDT", ic: "🪙" },
  { id: "PayPal", ic: "🌐" },
  { id: "Binance", ic: "🔶" },
];

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
  const { me, refresh } = useApp();
  const toast = useToast();
  const [method, setMethod] = useState("bKash");
  const [amount, setAmount] = useState("");

  async function submit(e) {
    e.preventDefault();
    const r = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, amount: Number(amount) }),
    });
    const d = await r.json();
    if (d.ok) {
      toast(`Payout requested · new balance $${fmtMoney(d.balance)}`, "ok");
      setAmount("");
      refresh();
    } else {
      toast(d.error, "err");
    }
  }

  if (!me) return (
    <>
      <div className="sk-card sk" />
      <div className="sk-card sk" />
    </>
  );

  if (!me.loggedIn) {
    return (
      <section className="tool">
        <span className="logo-chip"><svg viewBox="0 0 24 24"><path d="M3 6h18v13H3zM3 10h18" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/><circle cx="17" cy="14" r="1.3" fill="#fff"/></svg></span>
        <h2>Please login</h2>
        <p className="muted">You must be logged in to view your wallet.</p>
        <a href="/login" className="btn btn-lg" style={{ marginTop: 18 }}>Login</a>
      </section>
    );
  }

  return (
    <>
      <div className="hero">
        <div className="label">Available balance</div>
        <div className="balance"><span className="cur">$</span>{fmtMoney(me.balance)}</div>
        <span className="tag">▲ ${fmtMoney(CONFIG.USER_RATE)} per ad view</span>
      </div>

      <div className="card">
        <h3>💸 Request withdrawal</h3>
        <form onSubmit={submit}>
          <div className="field">
            <label>Method</label>
            <div className="chips">
              {METHODS.map((m) => (
                <div
                  key={m.id}
                  className={"chip" + (method === m.id ? " active" : "")}
                  onClick={() => setMethod(m.id)}
                >
                  <span className="ic">{m.ic}</span>{m.id}
                </div>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Amount ($)</label>
            <input
              type="number" step="0.0001" min="0.01" placeholder="0.01"
              value={amount} onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button className="btn btn-block" type="submit">Request payout</button>
        </form>
        <p className="hint" style={{ marginTop: 12 }}>
          Payouts are processed manually by the admin from network earnings. Funds are reserved when you request.
        </p>
      </div>

      <div className="card">
        <h3>Withdrawal history</h3>
        {me.withdrawals && me.withdrawals.length > 0 ? (
          <ul className="list">
            {me.withdrawals.map((w, i) => (
              <li key={i}>
                <span>💸 {w.method}</span>
                <span className="muted small">{ago(w.at)}</span>
                <span className="rec-amt minus">-${fmtMoney(w.amount)}</span>
                <span className="badge blue">{w.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <div className="e-ic">💸</div>
            <p>No withdrawals yet. Request your first payout above.</p>
          </div>
        )}
      </div>
    </>
  );
}
