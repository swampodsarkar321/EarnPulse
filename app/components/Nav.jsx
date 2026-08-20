export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="logo">⚡ EarnPulse</div>
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
