"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtMoney, CONFIG } from "../lib/config";
import { useApp } from "./AppShell";

function medal(i) {
  return ["🥇", "🥈", "🥉"][i] || null;
}
function initial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

export default function DashboardView() {
  const { me, lb } = useApp();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (me !== null) setReady(true);
  }, [me]);

  if (!ready)
    return (
      <>
        <div className="sk-card sk" />
        <div className="sk-card sk" />
        <div className="sk sk-line" style={{ width: "60%" }} />
        <div className="sk sk-line" style={{ width: "80%" }} />
      </>
    );

  if (!me.loggedIn)
    return (
      <section className="tool">
        <span className="logo-chip"><svg viewBox="0 0 24 24"><path d="M13 2 3 14h8l-1 8 11-13h-8z" fill="#fff" /></svg></span>
        <h2>Welcome to EarnPulse</h2>
        <p className="muted">Log in to watch ads, climb the leaderboard and cash out your earnings.</p>
        <Link href="/login" className="btn btn-lg" style={{ marginTop: 18 }}>Login to start</Link>
        <p className="hint" style={{ marginTop: 14 }}>New here? <Link href="/signup" className="link">Create a free account</Link></p>
      </section>
    );

  const you = lb.findIndex((u) => u.name === me.name);

  return (
    <>
      <div className="hero">
        <div className="label">Your balance</div>
        <div className="balance"><span className="cur">$</span>{fmtMoney(me.balance)}</div>
        <span className="tag">▲ Earn ${fmtMoney(CONFIG.USER_RATE)} per ad view</span>
      </div>

      <div className="stats">
        <div className="stat accent">
          <div className="k">Per view</div>
          <div className="v">${fmtMoney(CONFIG.USER_RATE)}</div>
        </div>
        <div className="stat green">
          <div className="k">Rank</div>
          <div className="v">#{you >= 0 ? you + 1 : "—"}</div>
        </div>
      </div>

      <Link href="/watch" className="btn btn-lg" style={{ marginBottom: 16 }}>
        ▶ Watch Ads &amp; Earn
      </Link>

      <div className="promo">
        🎉 Payouts via <b>bKash · Nagad · USDT</b> — withdraw anytime.
      </div>

      <div className="card">
        <h3>🏆 Top Earners</h3>
        {lb.length > 0 ? (
          <ul className="lb">
            {lb.map((u, i) => (
              <li key={u.name} className={i < 3 ? "top" : ""}>
                <span className="rank">{medal(i) || i + 1}</span>
                <span className="ava">{initial(u.name)}</span>
                <span className="name">{u.name}{u.name === me.name ? " (you)" : ""}</span>
                <span className="amt">${fmtMoney(u.balance)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <div className="e-ic">🏆</div>
            <p>No rankings yet — be the first to earn!</p>
          </div>
        )}
      </div>
    </>
  );
}
