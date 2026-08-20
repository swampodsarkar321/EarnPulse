import Nav from "./components/Nav";
import Footer from "./components/Footer";
import EarnButton from "./components/EarnButton";

export default function Home() {
  return (
    <>
      <Nav />

      <section className="hero">
        <div className="container">
          <h1>Watch Ads.<br />Earn Real Money.</h1>
          <p className="lead">
            Join thousands earning daily by watching ads and completing simple offers.
            No investment. Instant start.
          </p>
          <a href="#join" className="btn">Start Earning Free</a>
          <div className="hero-badges">
            <span>✓ PayPal</span>
            <span>✓ Crypto</span>
            <span>✓ Instant</span>
            <span>✓ Worldwide</span>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          <div className="stat"><h3>250K+</h3><p>Active earners</p></div>
          <div className="stat"><h3>$1.8M</h3><p>Paid out</p></div>
          <div className="stat"><h3>4.9★</h3><p>Trustpilot</p></div>
          <div className="stat"><h3>24/7</h3><p>Support</p></div>
        </div>
      </section>

      <section className="how">
        <div className="container">
          <h2>How it works</h2>
          <div className="cards">
            <div className="card"><div className="num">1</div><h3>Sign up free</h3>
              <p>Create your account in 10 seconds. No card, no fees.</p></div>
            <div className="card"><div className="num">2</div><h3>Watch &amp; complete</h3>
              <p>View ads and complete offers from our partners.</p></div>
            <div className="card"><div className="num">3</div><h3>Get paid</h3>
              <p>Withdraw earnings to PayPal, crypto or bank.</p></div>
          </div>
        </div>
      </section>

      <section className="offers">
        <div className="container">
          <h2>Earn now</h2>
          <p className="muted">Click the links below, watch the ad, and earn. Each click pays you.</p>
          {/* TODO: replace href with your shrtfly shortlinks from /tools */}
          <div className="offer-frame">
            <div className="earn-list">
              <EarnButton label="▶ Watch ad & earn $0.01" />
              <EarnButton label="▶ Watch ad & earn $0.01" />
              <EarnButton label="▶ Watch ad & earn $0.01" />
              <p className="muted" style={{ marginTop: 14 }}>
                Login required. Each click credits your balance; the owner keeps the margin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="cta">
        <div className="container">
          <h2>Ready to earn?</h2>
          <p>Create your free account and watch your balance grow.</p>
          <a href="/dashboard" className="btn btn-lg">Create Free Account</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
