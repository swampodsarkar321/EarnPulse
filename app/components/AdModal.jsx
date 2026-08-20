"use client";
import { useState, useEffect, useRef } from "react";
import { fmtMoney, CONFIG } from "../lib/config";

const CD = CONFIG.AD_REPLAY_COOLDOWN_MS || 60000;
const R = 36;
const C = 2 * Math.PI * R;
function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdModal({ ad }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("loading"); // loading|viewing|done|success|error
  const [token, setToken] = useState(null);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(12);
  const [msg, setMsg] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [dailyDone, setDailyDone] = useState(false);
  const ivRef = useRef(null);

  const id = ad.id || ad.adUrl;
  const cdKey = "ep_ad_cd_" + id;
  const dayKey = "ep_ad_day_" + id;

  useEffect(() => {
    let iv;
    setDailyDone(localStorage.getItem(dayKey) === today());
    const until = Number(localStorage.getItem(cdKey) || 0);
    setCooldownUntil(until);
    if (until > Date.now()) {
      iv = setInterval(() => {
        if (Date.now() >= until) {
          setCooldownUntil(0);
          clearInterval(iv);
        }
      }, 1000);
    }
    return () => { clearInterval(iv); clearInterval(ivRef.current); };
  }, [cdKey, dayKey]);

  function close() {
    clearInterval(ivRef.current);
    setOpen(false);
    setStage("loading");
    setToken(null);
  }

  async function start() {
    if (cooling || dailyDone) return;
    setOpen(true);
    setStage("loading");
    setMsg("");
    const r = await fetch("/api/earn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: ad.id || null }),
    });
    const d = await r.json();
    if (!d.ok) {
      if (d.error === "daily_limit") {
        localStorage.setItem(dayKey, today());
        setDailyDone(true);
        setStage("error");
        setMsg(d.msg || "Daily limit reached for this ad.");
        return;
      }
      setStage("error");
      setMsg(d.error === "wait" ? `Please wait ${Math.ceil(d.wait)}s between ads.` : "Please log in to earn.");
      return;
    }
    const openUrl = d.adUrl || ad.adUrl;
    if (openUrl) window.open(openUrl, "_blank", "noopener");
    setToken(d.token);

    const left0 = Math.ceil(d.wait || 12);
    setTotal(left0);
    setCount(left0);
    setStage("viewing");
    clearInterval(ivRef.current);
    ivRef.current = setInterval(() => {
      setCount((c) => {
        const n = c - 1;
        if (n <= 0) {
          clearInterval(ivRef.current);
          setStage("done");
          return 0;
        }
        return n;
      });
    }, 1000);
  }

  async function claim() {
    const r = await fetch("/api/earn/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const d = await r.json();
    if (d.ok) {
      const until = Date.now() + CD;
      localStorage.setItem(cdKey, until);
      setCooldownUntil(until);
      setMsg(`Reward claimed! Balance: $${fmtMoney(d.balance)}`);
    } else {
      setMsg(d.error || "Could not claim");
    }
    setStage("success");
  }

  const cooling = cooldownUntil > Date.now();
  const secsLeft = cooling ? Math.ceil((cooldownUntil - Date.now()) / 1000) : 0;
  const progress = total ? (total - count) / total : 0;
  const offset = C * (1 - progress);

  const disabled = cooling || dailyDone;
  const label = dailyDone
    ? "Daily limit reached"
    : cooling
    ? `Available in ${secsLeft}s`
    : "▶ Watch";

  return (
    <>
      <button className="ad-watch" disabled={disabled} onClick={start}>
        {label}
      </button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={close} aria-label="Close">×</button>
            <div className="modal-head">
              <div className="ad-thumb">{ad.icon || "🎬"}</div>
              <div className="ad-info">
                <b>{ad.title}</b>
                <span className="muted">{ad.advertiser}</span>
              </div>
              <div className="ad-reward">+${fmtMoney(ad.amount)}</div>
            </div>

            <div className="view-frame">
              {stage === "loading" && (
                <>
                  <div className="spinner" />
                  <p className="muted">Preparing your ad…</p>
                </>
              )}

              {stage === "viewing" && (
                <>
                  <div className="ring-wrap">
                    <svg className="ring" viewBox="0 0 84 84">
                      <circle className="track" cx="42" cy="42" r={R} />
                      <circle className="bar" cx="42" cy="42" r={R} strokeDasharray={C} strokeDashoffset={offset} />
                    </svg>
                    <span className="pct">{count}s</span>
                  </div>
                  <p className="big">Ad opened in a new tab</p>
                  <p className="muted small">Keep this tab open · reward unlocks in <b>{count}s</b></p>
                </>
              )}

              {stage === "done" && (
                <>
                  <div className="empty" style={{ padding: "8px 0" }}>
                    <div className="e-ic" style={{ background: "rgba(62,207,142,.16)", color: "var(--green)" }}>✅</div>
                    <p className="big" style={{ color: "var(--green)" }}>Ad viewed!</p>
                    <p className="muted small">Claim your reward below.</p>
                  </div>
                </>
              )}

              {stage === "error" && <p className="err">⚠️ {msg}</p>}
              {stage === "success" && <p className="ok">✅ {msg}</p>}
            </div>

            {stage === "viewing" && <button className="btn btn-block" disabled>Please wait {count}s…</button>}
            {stage === "done" && <button className="btn btn-green btn-block" onClick={claim}>Claim +${fmtMoney(ad.amount)}</button>}
            {stage === "success" && <button className="btn btn-ghost btn-block" onClick={close}>Close</button>}
            {stage === "error" && <a href="/login" className="btn btn-block">Login to earn</a>}
          </div>
        </div>
      )}
    </>
  );
}
