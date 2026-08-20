// Profit / payout configuration.
// The network (shrtfly) pays the OWNER NETWORK_RATE per click.
// The user is credited USER_RATE. The difference is OWNER PROFIT.
export const CONFIG = {
  NETWORK_RATE: 0.02, // what shrtfly pays you per click (example rate)
  USER_RATE: 0.01,    // what the user gets credited
  // owner profit per click = NETWORK_RATE - USER_RATE = 0.01 (50% margin)
  ADMIN_KEY: "ep-admin-123", // change this! used for /admin

  // Anti-fraud / verification
  COOLDOWN_MS: 15000, // min gap between earns per user (server-enforced)
  WAIT_MS: 12000,     // user must wait this long after opening ad before claiming
  TASK_TTL_MS: 120000, // a task token expires if not claimed in 2 min

  // Destination the shrtfly shortlink points to (change to a real offer page)
  AD_DESTINATION: "https://example.com/page",
};
