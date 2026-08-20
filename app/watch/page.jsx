"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AdModal from "../components/AdModal";
import { AD_LINKS } from "../lib/links";
import { CONFIG, fmtMoney } from "../lib/config";

const ADS = [
  { id: "ad1", icon: "🛒", title: "Top online store deal", advertiser: "Sponsor · Mainstream", amount: CONFIG.USER_RATE, adUrl: AD_LINKS[0] },
  { id: "ad2", icon: "🎮", title: "New mobile game release", advertiser: "Sponsor · Mainstream", amount: CONFIG.USER_RATE, adUrl: AD_LINKS[1] },
  { id: "ad3", icon: "📱", title: "Win a gift card", advertiser: "Sponsor · Mainstream", amount: CONFIG.USER_RATE, adUrl: AD_LINKS[2] },
];

export default function Watch() {
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
          <div className="tool">
            <h2>Please login</h2>
            <p className="muted">You must be logged in to watch ads and earn.</p>
            <a href="/login" className="btn">Login</a>
          </div>
        )}

        {me && me.loggedIn && (
          <>
            <div className="section-head" style={{ textAlign: "left", marginBottom: 26, maxWidth: "100%" }}>
              <span className="eyebrow">Watch ads</span>
              <h2 style={{ fontSize: 30 }}>Earn by watching ads</h2>
              <p className="muted">Open the sponsor ad in a new tab, view it, wait, then claim your reward. Limit 20 views per ad per day.</p>
            </div>

            <div className="offer-frame">
              <div className="ad-list">
                {ADS.map((ad) => (
                  <div className="ad-card" key={ad.id}>
                    <div className="ad-thumb">{ad.icon}</div>
                    <div className="ad-info">
                      <b>{ad.title}</b>
                      <span className="muted">{ad.advertiser}</span>
                    </div>
                    <div className="ad-reward">+${fmtMoney(ad.amount)}</div>
                    <AdModal ad={ad} />
                  </div>
                ))}
              </div>
              <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
                New ads are added daily. The more you watch, the more you earn.
              </p>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
