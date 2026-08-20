"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";

export default function Login() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", name, pass }),
    });
    const d = await r.json();
    if (d.ok) router.push("/");
    else setErr(d.error);
  }

  return (
    <AppShell>
      <section className="tool">
        <h2>Login</h2>
        <form className="form-row" style={{ justifyContent: "center" }} onSubmit={submit}>
          <div><label>Username</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label>Password</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} /></div>
          <div><label>&nbsp;</label><button className="btn" type="submit">Login</button></div>
        </form>
        {err && <p className="muted" style={{ color: "#ff6b6b" }}>{err}</p>}
        <p className="muted" style={{ marginTop: 14 }}>No account? <a href="/signup" style={{ color: "var(--accent-2)" }}>Sign up</a></p>
      </section>
    </AppShell>
  );
}
