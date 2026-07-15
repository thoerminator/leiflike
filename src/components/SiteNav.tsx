"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { login } from "@/lib/store";

interface Props {
  mode: "work" | "about";
  onWork: () => void;
  onAbout: () => void;
  visible?: boolean;
}

/**
 * Mitte: der Modus-Switch (Portfolio | Über mich).
 * Oben rechts: Ecken-Insel mit DE/EN-Stempel, Schreibtischlampe (Dark Mode)
 * und dem Admin-Schlüssel, der ein Anmeldefeld öffnet.
 */
export function SiteNav({ mode, onWork, onAbout, visible = true }: Props) {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [adminOpen, setAdminOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const popRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!adminOpen) return;
    const close = (e: PointerEvent) => {
      if (!popRef.current?.contains(e.target as Node)) setAdminOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [adminOpen]);

  const submitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await login(pw);
    setBusy(false);
    if (ok) router.push("/admin");
    else setErr(true);
  };

  return (
    <>
      {/* Mitte: nur die beiden Modi */}
      <motion.nav
        className="ll-nav"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: visible ? 0 : -60, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        aria-label="Navigation"
      >
        <button className="ll-nav-item" data-active={mode === "work"} onClick={onWork}>
          {t("portfolio")}
          {mode === "work" && <motion.span layoutId="nav-underline" className="ll-nav-underline" />}
        </button>
        <button className="ll-nav-item" data-active={mode === "about"} onClick={onAbout}>
          {t("about")}
          {mode === "about" && <motion.span layoutId="nav-underline" className="ll-nav-underline" />}
        </button>
      </motion.nav>

      {/* Ecke rechts: Sprache · Lampe · Admin */}
      <motion.div
        className="ll-nav ll-nav--corner"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: visible ? 0 : -60, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.06 }}
      >
        <button
          className="ll-stamp"
          style={{ fontSize: "0.66rem" }}
          onClick={() => setLocale(locale === "de" ? "en" : "de")}
          aria-label="Sprache wechseln"
        >
          {locale.toUpperCase()}
        </button>
        <button
          className="ll-nav-icon"
          onClick={toggle}
          aria-label={theme === "dark" ? "Licht an" : "Licht aus"}
          title={theme === "dark" ? "Licht an" : "Licht aus"}
        >
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 17.5 h8" />
            <path d="M9 17.5 L7.5 11" />
            <path d="M7.5 11 L11.5 5.5" />
            <path d="M9.6 4 a3 3 0 0 1 4.4 2.6 l-4.6 1.6 a3 3 0 0 1 0.2 -4.2 Z" fill={theme === "dark" ? "currentColor" : "none"} />
            {theme === "dark" && (
              <g opacity="0.7">
                <path d="M13 10 L14.6 12.4" />
                <path d="M11 10.8 L11.6 13.4" />
              </g>
            )}
          </svg>
        </button>
        <button
          className="ll-nav-icon"
          onClick={() => {
            setErr(false);
            setAdminOpen((o) => !o);
          }}
          aria-label={t("adminLogin")}
          title={t("adminLogin")}
        >
          {/* Schlüssel */}
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="3.4" />
            <path d="M9.5 9.5 L16.5 16.5" />
            <path d="M13.6 13.6 L15.6 11.6" />
          </svg>
        </button>
      </motion.div>

      <AnimatePresence>
        {adminOpen && (
          <motion.form
            ref={popRef}
            className="ll-admin-pop"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onSubmit={submitAdmin}
          >
            <strong style={{ display: "block", color: "var(--text-strong)", marginBottom: 10, fontSize: "0.92rem" }}>
              {t("adminLogin")}
            </strong>
            <div className="ll-field">
              <label>{t("password")}</label>
              <input
                type="password"
                value={pw}
                autoFocus
                onChange={(e) => {
                  setPw(e.target.value);
                  setErr(false);
                }}
              />
            </div>
            {err && (
              <p style={{ color: "#c0392b", fontSize: "0.8rem", margin: "0 0 8px" }}>{t("wrongPassword")}</p>
            )}
            <button className="ll-btn" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
              {busy ? "…" : "→"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}
