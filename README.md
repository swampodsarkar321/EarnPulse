# EarnPulse — Watch Ads & Earn (Next.js, full stack)

A complete "watch ads / complete offers" site with **user accounts, balances,
and a built-in owner profit margin**. Built with Next.js (React), deployable to
Vercel in one click. The shrtfly API key is kept **server-side**.

## Profit model (the important part)
Every time a user "earns" by clicking an ad:
- The **owner** is credited `NETWORK_RATE` (what shrtfly pays per click).
- The **user** is credited `USER_RATE` (less than NETWORK_RATE).
- The **difference stays as owner profit**.

Configured in `app/lib/config.js`:
```js
NETWORK_RATE: 0.02,  // shrtfly pays owner $0.02 / click
USER_RATE:    0.01,  // user gets $0.01 / click
// owner profit = $0.01 / click  (50% margin)
```
Change these to tune your margin. The `/admin` page shows live net profit.

## Structure
```
app/
├─ page.jsx              landing (earn buttons call /api/earn)
├─ signup/ login/        auth pages
├─ dashboard/            user wallet + earn + withdrawal request
├─ admin/                owner profit panel (key protected)
├─ tools/                shrtfly shortlink generator
├─ api/
│  ├─ auth/route.js      signup/login (sets cookie)
│  ├─ earn/route.js      credits user + owner profit
│  ├─ me/route.js        current user balance
│  ├─ owner/route.js     owner stats (profit, clicks)
│  └─ shorten/route.js   shrtfly API (key hidden)
└─ lib/                 config.js, store.js (data layer)
```

## Deploy to Vercel
1. Upload this folder to GitHub → Vercel → import (Next.js auto-detected) → Deploy.
2. Settings → Environment Variables → add `SHRTFLY_API_KEY`.
3. Redeploy.

## ⚠️ Production notes
- `app/lib/store.js` uses a local `data.json` file for demo. On Vercel's
  serverless FS this is **not persistent** — swap it for Vercel KV / a database
  (Postgres, Upstash Redis) before going live with real users.
- Change `ADMIN_KEY` in `app/lib/config.js`.
- Do NOT use Google AdSense on incentivized sites (banned); use shrtfly /
  CPA networks. Regenerate your shrtfly key after sharing it in chat.
