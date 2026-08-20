"use client";
import { useApp } from "../components/AppShell";
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
  const { me } = useApp();

  if (!me) return (
    <>
      <div className="sk-card sk" />
      <div className="sk-card sk" />
    </>
  );

  if (!me.loggedIn) {
    return (
      <section className="tool">
        <span className="logo-chip"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#fff"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="#fff"/></svg></span>
        <h2>Please login</h2>
        <p className="muted">You must be logged in to view your profile.</p>
        <a href="/login" className="btn btn-lg" style={{ marginTop: 18 }}>Login</a>
      </section>
    );
  }

  const initial = (me.name || "?").trim().charAt(0).toUpperCase();

  return (
    <>
      <div className="hero" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div className="ava" style={{ width: 60, height: 60, fontSize: 24, borderRadius: 18 }}>{initial}</div>
        <div>
          <div className="label">{me.name}</div>
          <div className="balance" style={{ fontSize: 28 }}><span className="cur">$</span>{fmtMoney(me.balance)}</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat accent">
          <div className="k">Per view</div>
          <div className="v">${fmtMoney(CONFIG.USER_RATE)}</div>
        </div>
        <div className="stat green">
          <div className="k">Ads watched</div>
          <div className="v">{me.recent ? me.recent.length : 0}</div>
        </div>
      </div>

      <div className="card">
        <h3>👤 Account</h3>
        <ul className="list">
          <li><span>Username</span><span className="rec-amt neutral">{me.name}</span></li>
          <li><span>Balance</span><span className="rec-amt">${fmtMoney(me.balance)}</span></li>
          <li><span>Rate</span><span className="muted">{fmtMoney(CONFIG.USER_RATE)} / view</span></li>
        </ul>
        <div className="btn-row" style={{ marginTop: 16 }}>
          <a href="/watch" className="btn btn-sm">Watch Ads</a>
          <a href="/wallet" className="btn btn-sm btn-ghost">Wallet</a>
        </div>
      </div>

      <div className="card">
        <h3>🎬 Recent activity</h3>
        {me.recent && me.recent.length > 0 ? (
          <ul className="list">
            {me.recent.map((r, i) => (
              <li key={i}>
                <span>🎬 Watched ad</span>
                <span className="muted small">{ago(r.at)}</span>
                <span className="rec-amt">+${fmtMoney(r.amount || 0)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <div className="e-ic">🎬</div>
            <p>No activity yet. Watch your first ad to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}
