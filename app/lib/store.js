import { db } from "./firebase";
import { ref, get, set, child, update, push } from "firebase/database";
import { CONFIG } from "./config";

// All data lives in Firebase Realtime Database now (persists on Vercel).
// Structure:
//   users/<name> = { pass, balance, lastEarnAt }
//   users/<name>/daily/<YYYY-MM-DD>/ads/<adId> = <count>   (per-ad daily views)
//   users/<name>/history = [ { amount, at } ]
//   owner        = { profit, clicks, paidOut }
//   tasks/<token> = { name, userAmount, ownerProfit, adId, createdAt, expiresAt, claimed }

function today() {
  return new Date().toISOString().slice(0, 10);
}
export async function getUser(name) {
  const snap = await get(child(ref(db, "users"), name));
  return snap.exists() ? snap.val() : null;
}

export async function createUser(name, pass) {
  const snap = await get(child(ref(db, "users"), name));
  if (snap.exists()) return false;
  await set(child(ref(db, "users"), name), { pass, balance: 0 });
  return true;
}

export async function verify(name, pass) {
  const u = await getUser(name);
  return !!(u && u.pass === pass);
}

export async function getOwner() {
  const snap = await get(ref(db, "owner"));
  return snap.exists() ? snap.val() : { profit: 0, clicks: 0, paidOut: 0 };
}

export async function addEarning(name, userAmount, ownerProfit) {
  const u = await getUser(name);
  if (!u) return null;
  const newBalance = (u.balance || 0) + userAmount;
  await set(child(ref(db, "users"), name), { ...u, balance: newBalance });

  const o = await getOwner();
  const newOwner = {
    profit: (o.profit || 0) + ownerProfit,
    clicks: (o.clicks || 0) + 1,
    paidOut: o.paidOut || 0,
  };
  await set(ref(db, "owner"), newOwner);
  return newBalance;
}

export async function withdraw(name, amount) {
  const u = await getUser(name);
  if (!u || u.balance < amount) return false;
  await set(child(ref(db, "users"), name), { ...u, balance: u.balance - amount });

  const o = await getOwner();
  await set(ref(db, "owner"), { ...o, paidOut: (o.paidOut || 0) + amount });
  return true;
}

// --- Verification / anti-fraud task flow ---
// A reward is only credited after the user opens the ad AND claims with a
// valid, unexpired, unclaimed task token. Prevents instant/bot crediting.

export async function cooldownOk(name) {
  const u = await getUser(name);
  if (!u || !u.lastEarnAt) return true;
  return Date.now() - u.lastEarnAt >= CONFIG.COOLDOWN_MS;
}

export async function createTask(name, userAmount, ownerProfit, adId) {
  const token =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  await set(ref(db, "tasks/" + token), {
    name,
    userAmount,
    ownerProfit,
    adId: adId || null,
    createdAt: Date.now(),
    expiresAt: Date.now() + CONFIG.TASK_TTL_MS,
    claimed: false,
  });
  // start cooldown now
  const u = await getUser(name);
  if (u) await set(child(ref(db, "users"), name), { ...u, lastEarnAt: Date.now() });
  return token;
}

// Per-ad daily view limit (anti-abuse). Counts only successful (claimed) views.
export async function getDailyCount(name, adId, date) {
  const snap = await get(ref(db, `users/${name}/daily/${date}/ads/${adId}`));
  return snap.exists() ? Number(snap.val() || 0) : 0;
}

export async function incDailyCount(name, adId, date) {
  const cur = await getDailyCount(name, adId, date);
  await set(ref(db, `users/${name}/daily/${date}/ads/${adId}`), cur + 1);
  return cur + 1;
}

export async function creditTask(token) {
  const snap = await get(ref(db, "tasks/" + token));
  if (!snap.exists()) return { error: "invalid task" };
  const t = snap.val();
  if (t.claimed) return { error: "already claimed" };
  if (Date.now() > t.expiresAt) return { error: "expired" };

  const name = t.name;
  const u = await getUser(name);
  if (!u) return { error: "user not found" };
  const newBalance = (u.balance || 0) + t.userAmount;
  await set(child(ref(db, "users"), name), { ...u, balance: newBalance });

  // keep a short recent-activity history for the dashboard
  await push(ref(db, "users/" + name + "/history"), {
    amount: t.userAmount,
    at: Date.now(),
  });

  const o = await getOwner();
  const newOwner = {
    profit: (o.profit || 0) + t.ownerProfit,
    clicks: (o.clicks || 0) + 1,
    paidOut: o.paidOut || 0,
  };
  await set(ref(db, "owner"), newOwner);

  // count this successful view toward the per-ad daily limit
  if (t.adId) {
    const dCount = await incDailyCount(name, t.adId, today());
    var dailyLeft = CONFIG.AD_DAILY_LIMIT - dCount;
  }

  await set(ref(db, "tasks/" + token), { ...t, claimed: true, claimedAt: Date.now() });
  return { ok: true, balance: newBalance, earned: t.userAmount, ownerProfit: t.ownerProfit, dailyLeft: typeof dailyLeft === "number" ? dailyLeft : null };
}
