export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand"><span className="mark">⚡</span> EarnPulse</div>
            <p className="desc">
              EarnPulse is a rewards platform that pays you to watch ads and complete
              simple offers from trusted partners. Earn in your free time and cash out
              your balance with fast, flexible payouts.
            </p>
            <div className="pay-badges">
              <span>bKash</span>
              <span>Nagad</span>
              <span>USDT</span>
              <span>PayPal</span>
              <span>Binance</span>
            </div>
          </div>

          <div>
            <h4>Platform</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/tools">Link Tools</a></li>
              <li><a href="/#how">How it works</a></li>
              <li><a href="/#join">Get started</a></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="/#about">About us</a></li>
              <li><a href="/#why">Why EarnPulse</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/#support">Support</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="/#terms">Terms of Service</a></li>
              <li><a href="/#privacy">Privacy Policy</a></li>
              <li><a href="/#cookie">Cookie Policy</a></li>
              <li><a href="/#refund">Refund Policy</a></li>
              <li><a href="/#kyc">KYC &amp; Anti-Fraud</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EarnPulse. All rights reserved.</span>
          <span>
            Earnings depend on advertiser availability and valid ad views. EarnPulse is
            not a bank or investment product — no purchase required to earn.
          </span>
        </div>
      </div>
    </footer>
  );
}
