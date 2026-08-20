export default function Nav() {
  return (
    <header className="nav">
      <div className="announce">
        🎉 Earn <b>$0.0005</b> for every ad you watch · Instant payouts via bKash, Nagad &amp; USDT
      </div>
      <div className="container nav-inner">
        <div className="logo"><span className="mark">⚡</span> EarnPulse</div>
        <nav>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/tools">Tools</a>
          <a href="/login">Login</a>
          <a href="/#join" className="btn btn-sm">Get Started</a>
        </nav>
      </div>
    </header>
  );
}
