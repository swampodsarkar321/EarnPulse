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
        <h2>Please login</h2>
        <p className="muted">You must be logged in to watch ads and earn.</p>
        <a href="/login" className="btn btn-lg">Login</a>
      </section>
    );
  }

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Watch ads</span>
        <h2>Earn by watching ads</h2>
        <p className="muted">Open the sponsor ad in a new tab, view it, wait, then claim. Limit 20 views per ad per day.</p>
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
      <p className="muted" style={{ marginTop: 14, textAlign: "center" }}>
        New ads are added daily. The more you watch, the more you earn.
      </p>

      {CONFIG.CPALEAD_PUB_ID && (
        <div className="panel" style={{ marginTop: 22 }}>
          <div className="section-head" style={{ textAlign: "left", marginBottom: 10 }}>
            <span className="eyebrow">Earn more</span>
            <h2>Complete offers &amp; get paid</h2>
            <p className="muted">Finish any offer in the wall below and your balance is credited automatically.</p>
          </div>
          <div className="ow-frame">
            <iframe
              title="CPAlead Offer Wall"
              src={`https://www.cpalead.com/wall.php?pub=${CONFIG.CPALEAD_PUB_ID}&sub=${encodeURIComponent(me.name)}`}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
}
