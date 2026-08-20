import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data.json");

function load() {
  if (!fs.existsSync(FILE)) {
    return { users: {}, owner: { profit: 0, clicks: 0, paidOut: 0 } };
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(d) {
  fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
}

export function getUser(name) {
  const d = load();
  return d.users[name];
}

export function createUser(name, pass) {
  const d = load();
  if (d.users[name]) return false;
  d.users[name] = { pass, balance: 0 };
  save(d);
  return true;
}

export function verify(name, pass) {
  const u = getUser(name);
  return u && u.pass === pass;
}

export function addEarning(name, userAmount, ownerProfit) {
  const d = load();
 if (!d.users[name]) return null;
  d.users[name].balance = (d.users[name].balance || 0) + userAmount;
  d.owner.profit = (d.owner.profit || 0) + ownerProfit;
  d.owner.clicks = (d.owner.clicks || 0) + 1;
  save(d);
  return d.users[name].balance;
}

export function withdraw(name, amount) {
  const d = load();
  const u = d.users[name];
  if (!u || u.balance < amount) return false;
  u.balance -= amount;
  d.owner.paidOut = (d.owner.paidOut || 0) + amount;
  save(d);
  return true;
}

export function getOwner() {
  return load().owner;
}
