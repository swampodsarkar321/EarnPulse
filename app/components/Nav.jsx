export default function Nav() {
  return (
    <header className="nav">
      <div className="announce">
        🎉 Earn <b>$0.0005</b> for every ad you watch · Instant payouts via bKash, Nagad &amp; USDT
      </div>
      <div className="container nav-inner">
        <div className="logo"><span className="mark"><svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg></span> EarnPulse</div>
        <nav>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/watch">Watch Ads</a>
          <a href="/wallet">Wallet</a>
          <a href="/profile">Profile</a>
          <a href="/login" className="btn btn-sm">Login</a>
        </nav>
      </div>
    </header>
  );
}
