"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAppData, resolveSrc } from "@/lib/store";
import { SiteNav } from "@/components/SiteNav";
import type { CVKind } from "@/lib/types";

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.33, 0.02, 0.18, 1] as const },
};

const kindColor: Record<CVKind, string> = {
  bildung: "var(--peri-400)",
  taetigkeit: "var(--violet-500)",
  engagement: "var(--pink-500)",
};

export function AboutContent() {
  const router = useRouter();
  const { t, l } = useI18n();
  const { profile, cv } = useAppData();

  return (
    <div data-hand-zone>
      {/* Nav außerhalb des animierten Containers — bleibt immer im Frame */}
      <SiteNav mode="about" onWork={() => router.push("/")} onAbout={() => {}} />

      <motion.main
        initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: [0.33, 0.02, 0.18, 1] }}
        style={{ minHeight: "100vh", background: "var(--surface)", overflowX: "hidden" }}
      >
        {/* Hero: Portrait + Intro */}
        <section
          className="ll-about-hero"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "clamp(96px, 13vw, 140px) clamp(20px, 5vw, 56px) clamp(24px, 6vw, 72px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "clamp(28px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          <motion.div {...rise} style={{ justifySelf: "center" }}>
            {profile.portrait && (
              <div
                className="ll-paper ll-portrait"
                style={{
                  transform: "rotate(-2.5deg)",
                  boxShadow: "inset 0 0 0 0.5px var(--paper-edge), var(--shadow-lg)",
                }}
              >
                <img
                  src={resolveSrc(profile.portrait.src)}
                  alt={profile.name}
                  style={{ objectPosition: `${profile.portraitFocus?.x ?? 60}% ${profile.portraitFocus?.y ?? 30}%` }}
                />
              </div>
            )}
          </motion.div>
          <motion.div {...rise}>
            <span className="ll-eyebrow" style={{ rotate: "-1deg" }}>{t("about")}</span>
            <h1 style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)", margin: "0.5em 0 0.2em" }}>{profile.name}</h1>
            <p
              style={{
                fontFamily: "var(--font-groovy)",
                fontSize: "clamp(1.25rem, 2.6vw, 1.7rem)",
                color: "var(--accent)",
                lineHeight: 1.15,
                margin: "0 0 0.9em",
              }}
            >
              {l(profile.role)}
            </p>
            <p style={{ fontSize: "1.08rem", lineHeight: 1.65, maxWidth: 520, whiteSpace: "pre-line" }}>
              {l(profile.intro)}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
              {profile.tools.map((tool) => (
                <span key={tool} className="ll-tag">
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CV-Timeline */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(30px, 5vw, 60px) clamp(20px, 5vw, 56px) clamp(60px, 8vw, 110px)" }}>
          <motion.div {...rise} style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap", marginBottom: "1.8em" }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", margin: 0 }}>{t("journey")}</h2>
            <span style={{ display: "flex", gap: 14, fontSize: "0.78rem", fontWeight: 600, color: "var(--text-mut)" }}>
              {(Object.keys(kindColor) as CVKind[]).map((k) => (
                <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: kindColor[k] }} />
                  {t(k)}
                </span>
              ))}
            </span>
          </motion.div>
          <div style={{ position: "relative", paddingLeft: 42 }}>
            <svg
              style={{ position: "absolute", left: 8, top: 0, height: "100%", width: 24, overflow: "visible" }}
              viewBox="0 0 24 1000"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path
                d="M12,0 C15,120 9,180 13,300 C16,420 8,480 12,600 C15,720 9,800 12,1000"
                fill="none"
                stroke="var(--pencil)"
                strokeWidth={2.2}
                strokeLinecap="round"
                opacity={0.5}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 2.2, ease: [0.33, 0.02, 0.18, 1] }}
              />
            </svg>
            {cv.map((e, i) => (
              <motion.div
                key={i}
                {...rise}
                transition={{ ...rise.transition, delay: Math.min(i * 0.06, 0.4) }}
                style={{ position: "relative", marginBottom: "2.6em" }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: -38,
                    top: 6,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: kindColor[e.kind] ?? "var(--violet-500)",
                    boxShadow: "0 0 0 4px var(--surface), var(--shadow-paper)",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span className="ll-eyebrow" style={{ fontSize: "0.62rem", rotate: i % 2 ? "0.6deg" : "-0.6deg" }}>
                    {e.year}
                  </span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: kindColor[e.kind] ?? "var(--text-mut)",
                    }}
                  >
                    {t(e.kind)}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.35rem", margin: "0.6em 0 0.25em" }}>{l(e.title)}</h3>
                <p style={{ margin: 0, color: "var(--text-mut)", maxWidth: 620 }}>{l(e.detail)}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Kontakt-Fuß */}
        <footer className="ll-flow" style={{ borderRadius: "36px 36px 0 0" }}>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1100,
              margin: "0 auto",
              padding: "clamp(48px, 8vw, 96px) clamp(20px, 5vw, 56px)",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-groovy)",
                fontSize: "clamp(1.9rem, 5vw, 3.4rem)",
                lineHeight: 1.05,
                margin: "0 0 0.7em",
                textShadow: "0 6px 40px rgba(80,20,120,0.28)",
              }}
            >
              {l(profile.tagline)}
            </p>
            <a
              href={`mailto:${profile.email}`}
              style={{
                display: "inline-block",
                background: "#fff",
                color: "var(--ink-900)",
                fontWeight: 700,
                padding: "0.9em 2em",
                borderRadius: "var(--radius-pill)",
                textDecoration: "none",
                boxShadow: "var(--shadow-glow-violet)",
                transition: "transform var(--dur-fast) var(--ease-pop)",
              }}
            >
              {t("getInTouch")} →
            </a>
            <div style={{ marginTop: 34, fontSize: "0.9rem", opacity: 0.9, display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`mailto:${profile.email}`} style={{ color: "#fff" }}>
                {profile.email}
              </a>
              <a href={profile.instagram} target="_blank" rel="noreferrer" style={{ color: "#fff" }}>
                Instagram
              </a>
              <span>{l(profile.city)}</span>
            </div>
            <div style={{ marginTop: 16, fontSize: "0.82rem", opacity: 0.75, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/impressum" style={{ color: "#fff" }}>
                {t("imprint")}
              </Link>
              <Link href="/datenschutz" style={{ color: "#fff" }}>
                {t("privacy")}
              </Link>
            </div>
          </div>
        </footer>
      </motion.main>
    </div>
  );
}
