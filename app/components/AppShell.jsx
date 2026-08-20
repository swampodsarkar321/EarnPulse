"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { fmtMoney } from "../lib/config";

const AppContext = createContext(null);
export function useApp() {
  return useContext(AppContext);
}

function Bolt() {
  return <svg viewBox="0 0 24 24"><path d="M13 2 3 14h8l-1 8 11-13h-8z" /></svg>;
}
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 10.2 12 3l9 7.2" />
      <path d="M5 9.2V20h14V9.2" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5 16.5 12 10 15.5z" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="17" cy="14" r="1.3" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

const TABS = [
  { href: "/", label: "Home", icon: <HomeIcon /> },
  { href: "/watch", label: "Watch", icon: <PlayIcon /> },
  { href: "/wallet", label: "Wallet", icon: <WalletIcon /> },
  { href: "/profile", label: "Profile", icon: <UserIcon /> },
];

export default function AppShell({ children }) {
  const path = usePathname();
  const [me, setMe] = useState(null);
  const [lb, setLb] = useState([]);

  async function refresh() {
    const m = await fetch("/api/me").then((r) => r.json());
    setMe(m);
    return m;
  }

  useEffect(() => {
    refresh();
    fetch("/api/leaderboard").then((r) => r.json()).then((d) => setLb(d.list || []));
  }, []);

  const loggedIn = !!me?.loggedIn;
  const active = TABS.find(
    (t) => path === t.href || (t.href !== "/" && path.startsWith(t.href))
  )?.href;

  return (
    <AppContext.Provider value={{ me, setMe, refresh, lb }}>
      <div className="app">
        <header className="appbar">
          <div className="appbar-title"><Bolt /> EarnPulse</div>
          {loggedIn ? (
            <Link href="/wallet" className="appbar-bal">${fmtMoney(me.balance)}</Link>
          ) : (
            <Link href="/login" className="appbar-bal ghost">Login</Link>
          )}
        </header>

        <main className="appbody">{children}</main>

        {loggedIn && (
          <nav className="tabbar">
            {TABS.map((t) => (
              <Link key={t.href} href={t.href} className={"tab" + (active === t.href ? " active" : "")}>
                <span className="tab-ic">{t.icon}</span>
                <span className="tab-lb">{t.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </AppContext.Provider>
  );
}
