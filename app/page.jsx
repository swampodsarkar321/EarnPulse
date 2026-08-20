import Nav from "./components/Nav";
import Footer from "./components/Footer";
import EarnButton from "./components/EarnButton";
import { AD_LINKS } from "./lib/links";

export default function Home() {
  return (
    <>
      <Nav />

      <section className="hero">
        <div className="container">
          <span className="eyebrow">Trusted rewards platform</span>
          <h1>Watch Ads.<br />Earn Real Money.</h1>
          <p className="lead">
            Turn your spare time into earnings. Watch short ads and complete simple
            offers from trusted partners — no investment, no fees, instant start.
          </p>
          <a href="#join" className="btn btn-lg">Start Earning Free</a>
          <div className="hero-badges">
            <span>✓ Multiple payouts</span>
            <span>✓ Worldwide</span>
            <span>✓ Fast withdrawals</span>
            <span>✓ 100% free</span>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          <div className="stat"><h3>250K+</h3><p>Active earners</p></div>
          <div className="stat"><h3>$1.8M+</h3><p>Paid out</p></div>
          <div className="stat"><h3>4.9★</h3><p>User rating</p></div>
          <div className="stat"><h3>24/7</h3><p>Support</p></div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Three steps to your first payout</h2>
            <p>Getting started takes less than a minute. No documents, no upfront cost.</p>
          </div>
          <div className="cards">
            <div className="card"><div className="num">1</div><h3>Sign up free</h3>
              <p>Create your account in seconds. No card, no hidden fees.</p></div>
            <div className="card"><div className="num">2</div><h3>Watch &amp; complete</h3>
              <p>View partner ads and complete simple offers from your dashboard.</p></div>
            <div className="card"><div className="num">3</div><h3>Get paid</h3>
              <p>Withdraw your balance to bKash, Nagad, USDT, PayPal or bank.</p></div>
          </div>
        </div>
      </section>

      <section id="why" className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why EarnPulse</span>
            <h2>Built for people who actually get paid</h2>
          </div>
          <div className="feat-grid">
            <div className="feat"><div className="ic">🔒</div><h3>Secure &amp; private</h3>
              <p>Your data is protected and we never sell your information to third parties.</p></div>
            <div className="feat"><div className="ic">⚡</div><h3>Instant earnings</h3>
              <p>Balances update in real time after every verified ad view.</p></div>
            <div className="feat"><div className="ic">🌍</div><h3>Available worldwide</h3>
              <p>Earn from anywhere with flexible payout methods for every region.</p></div>
            <div className="feat"><div className="ic">💸</div><h3>Low minimum payout</h3>
              <p>Withdraw your earnings quickly without waiting for huge thresholds.</p></div>
            <div className="feat"><div className="ic">🤝</div><h3>Trusted partners</h3>
              <p>We work with verified advertisers so your time is always fairly rewarded.</p></div>
            <div className="feat"><div className="ic">🎧</div><h3>Real human support</h3>
              <p>A dedicated team is here 24/7 to help you with any issue.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Loved by earners</span>
            <h2>What our members say</h2>
          </div>
          <div className="testi-grid">
            <div className="testi"><p>"I withdraw to bKash every week. The ads are short and the balance updates instantly."</p>
              <div className="who"><div className="av">R</div><div><b>Rahim</b><span>Bangladesh</span></div></div></div>
            <div className="testi"><p>"Finally a site that actually pays. Clean dashboard, no confusing steps."</p>
              <div className="who"><div className="av">A</div><div><b>Ayesha</b><span>Pakistan</span></div></div></div>
            <div className="testi"><p>"I do a few ads daily on my phone. USDT payouts are super fast."</p>
              <div className="who"><div className="av">M</div><div><b>Marco</b><span>Philippines</span></div></div></div>
          </div>
        </div>
      </section>

      <section className="offers section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Start now</span>
            <h2>Earn by watching ads</h2>
            <p>Log in, open an ad, wait a few seconds, then claim your reward. Each view pays your balance.</p>
          </div>
          <div className="offer-frame">
            <div className="earn-list">
              <EarnButton label="▶ Watch ad & earn $0.01" adUrl={AD_LINKS[0]} />
              <EarnButton label="▶ Watch ad & earn $0.01" adUrl={AD_LINKS[1]} />
              <EarnButton label="▶ Watch ad & earn $0.01" adUrl={AD_LINKS[2]} />
              <p className="muted" style={{ marginTop: 14, textAlign: "center" }}>
                Login required. Each click opens a real ad (new tab), then claim your balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="cta">
        <div className="container">
          <div className="cta-box">
            <span className="eyebrow">Get started</span>
            <h2>Ready to earn?</h2>
            <p>Create your free account and watch your balance grow today.</p>
            <a href="/dashboard" className="btn btn-lg">Create Free Account</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
