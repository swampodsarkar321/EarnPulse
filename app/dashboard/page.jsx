"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import EarnButton from "../components/EarnButton";
import { AD_LINKS } from "../lib/ads";

export default function Dashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe);
  }, []);

  return (
    <>
      <Nav />
      <section className="dash container">
        {!me && <p className="muted">Loading...</p>}

        {me && !me.loggedIn && (
          <div className="tool container">
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
                <div className="amt">${me.balance.toFixed(2)}</div>
                <p style={{ opacity: .85, fontSize: 13 }}>Welcome, {me.name}</p>
              </div>
              <div className="bal" style={{ background: "linear-gradient(135deg,#00b894,#0984e3)" }}>
                <h3>Earn Per Click</h3>
                <div className="amt">$0.01</div>
                <p style={{ opacity: .85, fontSize: 13 }}>Watch &amp; earn</p>
              </div>
            </div>

            <div className="panel">
              <h3>Earn now</h3>
              <div className="earn-list">
                <EarnButton label="▶ Watch ad & earn $0.01" adUrl={AD_LINKS[0]} />
                <EarnButton label="▶ Watch ad & earn $0.01" adUrl={AD_LINKS[1]} />
                <EarnButton label="▶ Watch ad & earn $0.01" adUrl={AD_LINKS[2]} />
              </div>
            </div>

            <div className="panel">
              <h3>Request Withdrawal</h3>
              <div className="form-row">
                <div><label>Method</label>
                  <select><option>bKash</option><option>Nagad</option><option>USDT</option><option>PayPal</option></select></div>
                <div><label>Amount ($)</label><input type="number" placeholder="10.00" /></div>
                <div><label>&nbsp;</label><button className="btn">Request Payout</button></div>
              </div>
              <p className="muted" style={{ textAlign: "left", marginTop: 12 }}>
                Payouts are processed manually by the admin from network earnings.
              </p>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
