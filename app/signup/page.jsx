"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function Signup() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", name, pass }),
    });
    const d = await r.json();
    if (d.ok) router.push("/dashboard");
    else setErr(d.error);
  }

  return (
    <>
      <Nav />
      <section className="tool container">
        <h2>Sign Up — Free</h2>
        <form className="form-row" style={{ justifyContent: "center" }} onSubmit={submit}>
          <div><label>Username</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label>Password</label><input type="password" value={pass} onChange={(e) => setPass(e.target.value)} /></div>
          <div><label>&nbsp;</label><button className="btn" type="submit">Create Account</button></div>
        </form>
        {err && <p className="muted" style={{ color: "#ff6b6b" }}>{err}</p>}
        <p className="muted" style={{ marginTop: 14 }}>Have an account? <a href="/login" style={{ color: "var(--accent2)" }}>Login</a></p>
      </section>
      <Footer />
    </>
  );
}
