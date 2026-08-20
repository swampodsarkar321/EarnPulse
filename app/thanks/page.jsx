import AppShell from "../components/AppShell";

export default function Thanks() {
  return (
    <AppShell>
      <section className="tool" style={{ marginTop: 40 }}>
        <span className="eyebrow">Reward pending</span>
        <h2>Thanks for watching! 🎉</h2>
        <p className="muted" style={{ marginTop: 10 }}>
          Your ad view was recorded. Your reward is being credited to your EarnPulse
          balance shortly. You can close this tab and claim it in the app.
        </p>
        <a href="/" className="btn btn-lg">Back to App</a>
      </section>
    </AppShell>
  );
}
