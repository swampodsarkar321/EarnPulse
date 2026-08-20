import "./globals.css";
import Script from "next/script";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "EarnPulse — Watch Ads, Earn Real Money",
  description:
    "Watch ads and complete offers to earn real money. Fast payouts via PayPal, crypto and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="shrtfly-fullpage-vars"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var app_url = 'https://shrtfly.com/';
              var app_api_token = '2dbdc0275cb6e0075e39f1cb9723967f';
              var app_advert = 1;
              var app_exclude_domains = ["https://earn-pulse-d4hk.vercel.app"];
            `,
          }}
        />
        <Script
          src="https://shrtfly.com/js/full-page-script.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
