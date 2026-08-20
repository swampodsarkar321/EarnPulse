import "./globals.css";

export const metadata = {
  title: "EarnPulse — Watch Ads, Earn Real Money",
  description:
    "Watch ads and complete offers to earn real money. Fast payouts via PayPal, crypto and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
