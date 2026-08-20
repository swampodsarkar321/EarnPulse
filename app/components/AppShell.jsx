"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { fmtMoney } from "../lib/config";

function Bolt() {
  return <svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>;
}
function HomeIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 3 3 10v10a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10z" /></svg>;
}
function PlayIcon() {
  return <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
}
function WalletIcon() {
  return <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2H5a2 2 0 0 0-2 2zm0 2h15a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm12 4h3v2h-3z" /></svg>;
}
function UserIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4m0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5" /></svg>;
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

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then(setMe);
  }, []);

  const loggedIn = !!me?.loggedIn;
  const active = TABS.find(
    (t) => path === t.href || (t.href !== "/" && path.startsWith(t.href))
  )?.href;

  return (
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
  );
}
