import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Thanks() {
  return (
    <>
      <Nav />
      <section className="cta">
        <div className="container">
          <div className="cta-box">
            <span className="eyebrow">Reward pending</span>
            <h2>Thanks for watching! 🎉</h2>
            <p>
              Your ad view was recorded. Your reward is being credited to your
              EarnPulse balance shortly. You can close this tab and claim it on the
              dashboard.
            </p>
            <a href="/dashboard" className="btn btn-lg">Back to Dashboard</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
