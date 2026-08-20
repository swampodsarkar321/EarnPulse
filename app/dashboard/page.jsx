"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { fmtMoney, CONFIG } from "../lib/config";

function medal(i) {
  return ["🥇", "🥈", "🥉"][i] || `#${i + 1}`;
}

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [lb, setLb] = useState([]);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe);
    fetch("/api/leaderboard").then((r) => r.json()).then((d) => setLb(d.list || []));
  }, []);

  return (
    <>
      <Nav />
      <section className="dash container">
        {!me && <p className="muted">Loading...</p>}

        {me && !me.loggedIn && (
          <div className="tool">
            <h2>Please login</h2>
            <p className="muted">You must be logged in to view your dashboard.</p>
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
              <h3>🏆 Top Earners</h3>
              {lb.length > 0 ? (
                <ul className="lb">
                  {lb.map((u, i) => (
                    <li key={u.name} className={i < 3 ? "top" : ""}>
                      <span className="rank">{medal(i)}</span>
                      <span className="lb-name">
                        {u.name}{u.name === me.name ? " (you)" : ""}
                      </span>
                      <span className="lb-amt">${fmtMoney(u.balance)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No rankings yet — be the first to earn!</p>
              )}
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
