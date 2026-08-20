"use client";
import { useEffect, useState, createContext, useContext, useCallback } from "react";
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
function Coin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.2c0-1.2 1.1-2 2.5-2s2.5.9 2.5 2-1.1 1.8-2.5 1.8-2.5.8-2.5 2 1.1 2 2.5 2 2.5-.8 2.5-2" />
    </svg>
  );
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

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={"toast " + t.type}>
            <span className="ti">{t.type === "ok" ? "✓" : t.type === "err" ? "!" : "•"}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const ToastCtx = createContext(null);
export function useToast() {
  return useContext(ToastCtx);
}

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
      <ToastProvider>
        <div className="app">
          <header className="appbar">
            <div className="appbar-title">
              <span className="logo-chip"><Bolt /></span> EarnPulse
            </div>
            {loggedIn ? (
              <Link href="/wallet" className="appbar-bal"><Coin />${fmtMoney(me.balance)}</Link>
            ) : (
              <Link href="/login" className="appbar-bal ghost">Login</Link>
            )}
          </header>

          <main className="appbody">
            <div className="screen" key={path}>{children}</div>
          </main>

          {loggedIn && (
            <nav className="tabbar">
              {TABS.map((t) => (
                <Link key={t.href} href={t.href} className={"tab" + (active === t.href ? " active" : "")}>
                  <span className="tab-ic">{t.icon}</span>
                  <span>{t.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </ToastProvider>
    </AppContext.Provider>
  );
}
