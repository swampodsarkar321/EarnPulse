// Profit / payout configuration.
// 60 / 40 split: owner keeps OWNER_SHARE, user gets USER_SHARE of network payout.
export const CONFIG = {
  USER_RATE: 0.01,    // what the user is credited per ad view (40% share)
  OWNER_SHARE: 0.6,   // owner keeps 60%
  USER_SHARE: 0.4,    // user gets 40%
  // owner profit per click = USER_RATE * (OWNER_SHARE / USER_SHARE)
  ADMIN_KEY: "ep-admin-123", // change this! used for /admin

  // Anti-fraud / verification
  COOLDOWN_MS: 15000, // min gap between earns per user (server-enforced)
  WAIT_MS: 12000,     // user must wait this long after opening ad before claiming
  TASK_TTL_MS: 120000, // a task token expires if not claimed in 2 min

  // Destination the shrtfly shortlink points to (change to a real offer page)
  AD_DESTINATION: "https://example.com/page",
};
