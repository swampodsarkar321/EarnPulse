"use client";
import { AD_LINKS } from "../lib/links";
import { CONFIG, fmtMoney } from "../lib/config";
import { useApp } from "../components/AppShell";
import AdModal from "../components/AdModal";

const ADS = [
  { id: "ad1", icon: "🛒", title: "Top online store deal", advertiser: "Sponsor · Mainstream", amount: CONFIG.USER_RATE, adUrl: AD_LINKS[0] },
  { id: "ad2", icon: "🎮", title: "New mobile game release", advertiser: "Sponsor · Mainstream", amount: CONFIG.USER_RATE, adUrl: AD_LINKS[1] },
  { id: "ad3", icon: "📱", title: "Win a gift card", advertiser: "Sponsor · Mainstream", amount: CONFIG.USER_RATE, adUrl: AD_LINKS[2] },
];

export default function Watch() {
  const { me } = useApp();

  if (!me) return <p className="muted">Loading…</p>;

  if (!me.loggedIn) {
    return (
      <section className="tool">
        <span className="logo-chip"><svg viewBox="0 0 24 24"><path d="M13 2 3 14h8l-1 8 11-13h-8z" fill="#fff" /></svg></span>
        <h2>Please login</h2>
        <p className="muted">You must be logged in to watch ads and earn.</p>
        <a href="/login" className="btn btn-lg" style={{ marginTop: 18 }}>Login</a>
      </section>
    );
  }

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Watch ads</span>
        <h2>Earn by watching ads</h2>
        <p className="muted">Open the sponsor ad in a new tab, view it, wait, then claim. Limit {CONFIG.AD_DAILY_LIMIT} views per ad per day.</p>
      </div>

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

      <div className="card" style={{ marginTop: 16 }}>
        <p className="hint">💡 Tip: open each ad in a new tab and let it load fully. Rewards are credited after the timer ends. New ads are added daily.</p>
      </div>
    </>
  );
}
