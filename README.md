# EarnPulse — Watch Ads & Earn (Next.js, full stack)

A complete "watch ads / complete offers" site with **user accounts, balances,
and a built-in owner profit margin**. Built with Next.js (React), deployable to
Vercel in one click. The shrtfly API key is kept **server-side**.

## Verification / anti-fraud flow
A reward is NOT credited on click. Flow: click → server issues a task token and
creates a shrtfly shortlink carrying that token as `sub` → opens the real ad
(new tab) → shrtfly fires a **postback** to `/api/shrtfly-callback?sub=...` when
the ad is viewed → server credits balance + owner profit (server-verified). A
client **Claim** button (after a `WAIT_MS` wait) is a fallback if postback is not
configured/slow. Server also enforces per-user `COOLDOWN_MS` (15s) and task
`TASK_TTL_MS` (2 min). This stops bots / instant clicking.

### Enable shrtfly postback (recommended)
In the shrtfly publisher dashboard → **Tools → Postback URL**, set:
`https://<your-vercel-domain>/api/shrtfly-callback?sub={sub}`
and make sure shortlinks are created with a `sub` (our `/api/earn` does this via
the API `&sub=` param). Then credits happen only on real, network-confirmed views.

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

## Storage: Firebase Realtime Database
All user/balance/owner-profit data is stored in **Firebase Realtime Database**
(see `app/lib/firebase.js` + `app/lib/store.js`). It persists on Vercel (no
ephemeral file system issues).

Setup:
1. Firebase console → Realtime Database → create DB (region `asia-southeast1`).
2. The web config is already in `app/lib/firebase.js`.
3. **Lock down the database rules** (Rules tab) before real use, e.g.:
```
{
  "rules": {
    ".read": false,
    ".write": false,
    "users": { ".read": false, ".write": false },
    "owner": { ".read": false, ".write": false }
  }
}
```
⚠️ The web config's `apiKey` is public (normal for Firebase web). The app
currently writes via the web SDK, so while testing you may need rules open
(`".read": true, ".write": true`). For production, switch `app/lib/store.js`
to **Firebase Admin SDK** with a service account so the DB stays fully locked.
- Change `ADMIN_KEY` in `app/lib/config.js`.
- Do NOT use Google AdSense on incentivized sites (banned); use shrtfly /
  CPA networks. Regenerate your shrtfly key after sharing it in chat.
