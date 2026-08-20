"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../components/AppShell";
import { useToast } from "../components/AppShell";

export default function Login() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const { refresh } = useApp();
  const toast = useToast();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", name, pass }),
    });
    const d = await r.json();
    if (d.ok) {
      await refresh();
      toast("Welcome back!", "ok");
      router.push("/");
    } else setErr(d.error);
  }

  return (
    <section className="tool">
      <span className="logo-chip"><svg viewBox="0 0 24 24"><path d="M13 2 3 14h8l-1 8 11-13h-8z" fill="#fff" /></svg></span>
      <h2>Welcome back</h2>
      <p className="muted">Log in to keep earning.</p>

      <form className="form-card" onSubmit={submit}>
        <div className="field">
          <label>Username</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="your username" autoComplete="username" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
        </div>
        {err && <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 12 }}>{err}</p>}
        <button className="btn btn-block" type="submit">Login</button>
      </form>

      <p className="hint" style={{ marginTop: 16 }}>No account? <a href="/signup" className="link">Sign up free</a></p>
    </section>
  );
}
