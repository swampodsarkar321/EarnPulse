export default function Thanks() {
  return (
    <section className="tool" style={{ marginTop: 40 }}>
      <span className="logo-chip" style={{ background: "var(--grad-green)", boxShadow: "0 10px 30px rgba(62,207,142,.3)" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#052b1c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
      </span>
      <span className="eyebrow">Reward pending</span>
      <h2>Thanks for watching! 🎉</h2>
      <p className="muted" style={{ marginTop: 10 }}>
        Your ad view was recorded. Your reward is being credited to your EarnPulse
        balance shortly. You can close this tab and claim it in the app.
      </p>
      <a href="/" className="btn btn-lg" style={{ marginTop: 18 }}>Back to app</a>
    </section>
  );
}
