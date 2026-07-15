"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * 404 — im Bild bleiben: ein Blatt, das auf dem Tisch verrutscht ist.
 * Kein Sackgassen-Gefühl, sondern ein Weg zurück.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -1.2 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        style={{
          background: "var(--paper)",
          borderRadius: 4,
          padding: "clamp(32px, 6vw, 64px)",
          maxWidth: 480,
          boxShadow: "inset 0 0 0 0.5px var(--paper-edge), var(--shadow-lg)",
        }}
      >
        {/* Ein leeres Blatt mit Eselsohr */}
        <svg width="76" height="94" viewBox="0 0 76 94" style={{ marginBottom: 18 }} aria-hidden>
          <path
            d="M6 4 h44 l20 20 v66 a4 4 0 0 1 -4 4 h-60 a4 4 0 0 1 -4 -4 v-82 a4 4 0 0 1 4 -4 z"
            fill="none"
            stroke="var(--ink-300)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M50 4 v20 h20" fill="none" stroke="var(--ink-300)" strokeWidth="2.5" strokeLinejoin="round" />
          <path
            d="M22 52 q8 -9 16 0 q8 9 16 0"
            fill="none"
            stroke="var(--pink-500)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <h1
          style={{
            fontFamily: "var(--font-groovy)",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
            color: "var(--ink-900)",
            margin: "0 0 0.3em",
            lineHeight: 1,
          }}
        >
          Nichts gefunden
        </h1>
        <p style={{ color: "var(--ink-500)", fontSize: "1rem", marginBottom: "1.8em" }}>
          Diese Seite liegt nicht auf dem Tisch. Vielleicht wurde sie verschoben — oder es hat sich ein
          Tippfehler eingeschlichen.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              background: "var(--ink-900)",
              color: "var(--cream)",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "0.75em 1.6em",
              borderRadius: "var(--radius-pill)",
              textDecoration: "none",
            }}
          >
            Zum Tisch →
          </Link>
          <Link
            href="/about"
            style={{
              border: "1.5px solid var(--ink-100)",
              color: "var(--ink-700)",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "0.75em 1.6em",
              borderRadius: "var(--radius-pill)",
              textDecoration: "none",
            }}
          >
            Über mich
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
