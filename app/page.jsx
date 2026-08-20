import Nav from "./components/Nav";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />

      <section className="hero">
        <div className="container">
          <span className="eyebrow">Trusted rewards platform</span>
          <h1>Watch Ads.<br />Earn Real Money.</h1>
          <p className="lead">
            Turn your spare time into earnings. Watch short ads from trusted partners —
            no investment, no fees, instant start.
          </p>
          <a href="/watch" className="btn btn-lg">Start Earning Free</a>
          <div className="hero-badges">
            <span>✓ Multiple payouts</span>
            <span>✓ Worldwide</span>
            <span>✓ Fast withdrawals</span>
            <span>✓ 100% free</span>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
