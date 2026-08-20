import { db } from "./firebase";
import { ref, get, set, child, update } from "firebase/database";

// All data lives in Firebase Realtime Database now (persists on Vercel).
// Structure:
//   users/<name> = { pass, balance }
//   owner        = { profit, clicks, paidOut }

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
