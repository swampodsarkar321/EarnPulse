"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtMoney, CONFIG } from "../lib/config";

function medal(i) {
  return ["🥇", "🥈", "🥉"][i] || `#${i + 1}`;
}

export default function DashboardView() {
  const [me, setMe] = useState(null);
  const [lb, setLb] = useState([]);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe);
    fetch("/api/leaderboard").then((r) => r.json()).then((d) => setLb(d.list || []));
  }, []);

  if (!me) return <p className="muted">Loading…</p>;
  if (!me.loggedIn)
    return (
      <div className="tool">
        <h2>Welcome to EarnPulse</h2>
        <p className="muted">Login to watch ads and track your earnings.</p>
        <Link href="/login" className="btn btn-lg">Login</Link>
      </div>
    );

  return (
    <>
      <div className="promo">
        🎉 Earn <b>${fmtMoney(CONFIG.USER_RATE)}</b> per ad · Payouts: bKash · Nagad · USDT
      </div>

      <div className="wallet">
        <div className="bal accent">
          <h3>Balance</h3>
          <div className="amt">${fmtMoney(me.balance)}</div>
        </div>
        <div className="bal">
          <h3>Earn / Click</h3>
          <div className="amt">${fmtMoney(CONFIG.USER_RATE)}</div>
        </div>
      </div>

      <Link href="/watch" className="btn btn-lg" style={{ marginBottom: 14 }}>
        ▶ Watch Ads &amp; Earn
      </Link>

      <div className="panel">
        <h3>🏆 Top Earners</h3>
        {lb.length > 0 ? (
          <ul className="lb">
            {lb.map((u, i) => (
              <li key={u.name} className={i < 3 ? "top" : ""}>
                <span className="rank">{medal(i)}</span>
                <span className="lb-name">{u.name}{u.name === me.name ? " (you)" : ""}</span>
                <span className="lb-amt">${fmtMoney(u.balance)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No rankings yet — be the first to earn!</p>
        )}
      </div>
    </>
  );
}
