"use client";
import { useEffect, useState } from "react";
import { fmtMoney } from "../lib/config";

function ago(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return s + "s ago";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export default function MemberPanel() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe);
  }, []);

  if (!me) return null;

  if (!me.loggedIn) {
    return (
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="member-empty">
            <h3>Your earning space</h3>
            <p className="muted">Log in to see your balance, watch ads and track payouts.</p>
            <a href="/login" className="btn">Login to continue</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 28, textAlign: "left" }}>
          <span className="eyebrow">Your earning space</span>
          <h2 style={{ fontSize: 28 }}>Welcome back, {me.name} 👋</h2>
        </div>

        <div className="member-grid">
          <div className="member-balance">
            <span className="eyebrow" style={{ color: "var(--text)", opacity: .8 }}>Available balance</span>
            <div className="amt">${fmtMoney(me.balance || 0)}</div>
            <a href="/dashboard" className="btn btn-sm" style={{ marginTop: 14 }}>Withdraw</a>
          </div>

          <a href="#earn" className="opt-card">
            <div className="ic">▶</div>
            <b>Watch Ads</b>
            <span className="muted">Earn $0.01 per view</span>
          </a>
          <a href="/dashboard" className="opt-card">
            <div className="ic">👤</div>
            <b>Profile</b>
            <span className="muted">Account &amp; settings</span>
          </a>
          <a href="/dashboard" className="opt-card">
            <div className="ic">💸</div>
            <b>Payments</b>
            <span className="muted">bKash · Nagad · USDT</span>
          </a>
        </div>

        <div className="panel" style={{ marginTop: 24 }}>
          <h3>Recent activity</h3>
          {me.recent && me.recent.length > 0 ? (
            <ul className="recent">
              {me.recent.map((r, i) => (
                <li key={i}>
                  <span>🎬 Watched ad</span>
                  <span className="rec-amt">+${fmtMoney(r.amount || 0)}</span>
                  <span className="muted">{ago(r.at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No activity yet. Watch your first ad to get started.</p>
          )}
        </div>
      </div>
    </section>
  );
}
