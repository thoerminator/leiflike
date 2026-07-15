"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { useAppData } from "@/lib/store";
import { SiteNav } from "@/components/SiteNav";

/**
 * Gemeinsames Gerüst für Impressum und Datenschutz:
 * ein ruhiges Blatt Papier auf dem Tisch — gleiche Sprache wie der Rest,
 * nur ohne Bewegung. Pflichtangaben sollen sich nicht verstecken.
 */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  const router = useRouter();
  const { locale } = useI18n();
  const { profile } = useAppData();

  return (
    <div data-hand-zone style={{ minHeight: "100vh", background: "var(--surface)" }}>
      <SiteNav mode="about" onWork={() => router.push("/")} onAbout={() => router.push("/about")} />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.33, 0.02, 0.18, 1] }}
        style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(96px, 13vw, 140px) clamp(20px, 5vw, 40px) 80px" }}
      >
        <article
          className="ll-legal"
          style={{
            background: "var(--paper)",
            color: "var(--ink-700)",
            borderRadius: 4,
            padding: "clamp(28px, 5vw, 56px)",
            boxShadow: "inset 0 0 0 0.5px var(--paper-edge), var(--shadow-lg)",
            transform: "rotate(-0.25deg)",
          }}
        >
          <span className="ll-eyebrow" style={{ rotate: "0.6deg", borderColor: "var(--ink-900)", color: "var(--ink-900)" }}>
            {locale === "de" ? "Rechtliches" : "Legal"}
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4.6vw, 2.9rem)", margin: "0.6em 0 0.1em", color: "var(--ink-900)" }}>{title}</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--ink-500)", marginBottom: "2.4em" }}>{updated}</p>
          {children}
        </article>

        <nav
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 34,
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          <Link href="/">{locale === "de" ? "← Zum Tisch" : "← Back to the table"}</Link>
          <Link href="/impressum">{locale === "de" ? "Impressum" : "Legal notice"}</Link>
          <Link href="/datenschutz">{locale === "de" ? "Datenschutz" : "Privacy"}</Link>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </nav>
      </motion.main>
    </div>
  );
}

/** Kleiner, dauerhaft sichtbarer Fußzeilen-Link — Pflichtangaben müssen von
 *  jeder Seite aus erreichbar sein, auch vom Canvas. */
export function LegalCorner() {
  const { locale } = useI18n();
  return (
    <div className="ll-legal-corner">
      <Link href="/impressum">{locale === "de" ? "Impressum" : "Legal notice"}</Link>
      <span aria-hidden>·</span>
      <Link href="/datenschutz">{locale === "de" ? "Datenschutz" : "Privacy"}</Link>
    </div>
  );
}
