"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
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

export default function Profile() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe);
  }, []);

  return (
    <AppShell>
      {!me && <p className="muted">Loading...</p>}

      {me && !me.loggedIn && (
        <div className="tool">
          <h2>Please login</h2>
          <p className="muted">You must be logged in to view your profile.</p>
          <a href="/login" className="btn btn-lg">Login</a>
        </div>
      )}

      {me && me.loggedIn && (
        <>
          <div className="wallet">
            <div className="bal accent">
              <h3>{me.name}</h3>
              <div className="amt">${fmtMoney(me.balance)}</div>
            </div>
            <div className="bal">
              <h3>Earn / Click</h3>
              <div className="amt">${fmtMoney(CONFIG.USER_RATE)}</div>
            </div>
          </div>

          <div className="panel">
            <h3>Account</h3>
            <ul className="recent">
              <li><span>👤 Username</span><span className="rec-amt" style={{ color: "var(--text)" }}>{me.name}</span></li>
              <li><span>💰 Balance</span><span className="rec-amt">${fmtMoney(me.balance)}</span></li>
              <li><span>⚡ Rate</span><span className="muted">${fmtMoney(CONFIG.USER_RATE)} / view</span></li>
            </ul>
            <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/watch" className="btn btn-sm">Watch Ads</a>
              <a href="/wallet" className="btn btn-sm btn-ghost">Wallet</a>
            </div>
          </div>

          <div className="panel">
            <h3>Recent Activity</h3>
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
        </>
      )}
    </AppShell>
  );
}
