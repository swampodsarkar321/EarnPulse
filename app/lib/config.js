// Profit / payout configuration.
// The network (shrtfly) pays the OWNER NETWORK_RATE per click.
// The user is credited USER_RATE. The difference is OWNER PROFIT.
export const CONFIG = {
  NETWORK_RATE: 0.02, // what shrtfly pays you per click (example rate)
  USER_RATE: 0.01,    // what the user gets credited
  // owner profit per click = NETWORK_RATE - USER_RATE = 0.01 (50% margin)
  ADMIN_KEY: "ep-admin-123", // change this! used for /admin
};
