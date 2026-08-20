// Client + server safe: the shrtfly shortlinks users watch as ads.
// Each redirects (after the shrtfly interstitial ad) to our /thanks page.
// (Basic shrtfly shortener has no postback/sub param, so verification is done
// client-side via the wait+claim flow in EarnButton.)
export const AD_LINKS = [
  "https://shrtslug.biz/epadt1",
  "https://shrtslug.biz/epadt2",
  "https://shrtslug.biz/epadt3",
];
