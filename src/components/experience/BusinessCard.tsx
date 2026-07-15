"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAppData } from "@/lib/store";

interface Props {
  onIntroDone: () => void;
}

const CARD_W = 232;
const CARD_H = (CARD_W * 52) / 85;
const spring = { type: "spring" as const, stiffness: 130, damping: 20, mass: 1.05 };

/**
 * Die Visitenkarte: schwebt 3 s groß in der Mitte (3D-Tilt zur Maus),
 * fliegt dann nach unten links. Dort: frei verschiebbar (die Leisten oben
 * und unten sind Ränder), Klick flippt zur Kontakt-Rückseite. Faltet sich
 * ein Projekt auf, räumt sie sich selbst zurück in ihre Ecke.
 */
export function BusinessCard({ onIntroDone }: Props) {
  const { t } = useI18n();
  const { profile } = useAppData();
  const [phase, setPhase] = useState<"intro" | "table">("intro");
  const [flipped, setFlipped] = useState(false);
  const [focusedProject, setFocusedProject] = useState(false);
  const [hideOnMobile, setHideOnMobile] = useState(false);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const doneRef = useRef(false);
  const tapRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const [bounds, setBounds] = useState({ left: 12, right: 800, top: 84, bottom: 600 });

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const w = useMotionValue(CARD_W);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 16 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 120, damping: 16 });

  const home = () => ({ x: 24, y: window.innerHeight - CARD_H - 96 });

  // Startposition (Intro, zentriert) vor dem ersten Paint setzen
  useEffect(() => {
    const introW = Math.min(440, window.innerWidth * 0.86);
    x.set((window.innerWidth - introW) / 2);
    y.set(window.innerHeight * 0.44 - (introW * 52) / 85 / 2);
    w.set(introW);
    const update = () =>
      setBounds({
        left: 12,
        right: window.innerWidth - CARD_W - 12,
        top: 84, // unter der Nav-Insel
        bottom: window.innerHeight - CARD_H - 84, // über der Hinweis-Leiste
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyHome = () => {
    const h = home();
    animate(x, h.x, spring);
    animate(y, Math.min(h.y, bounds.bottom), spring);
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("table");
    animate(w, CARD_W, spring);
    flyHome();
    onIntroDone();
  };

  useEffect(() => {
    const t3 = setTimeout(finish, 3000);
    const skip = () => finish();
    window.addEventListener("wheel", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      clearTimeout(t3);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Projekt aufgefaltet → Karte räumt sich weg
  useEffect(() => {
    const onFocus = (e: Event) => {
      const isFocused = Boolean((e as CustomEvent).detail);
      setFocusedProject(isFocused);
      // Auf schmalen Screens liegt das Panel unten — Karte weicht ganz
      setHideOnMobile(isFocused && window.innerWidth <= 900);
      if (isFocused && doneRef.current) {
        setFlipped(false);
        flyHome();
      }
    };
    const onCarousel = (e: Event) => setCarouselOpen(Boolean((e as CustomEvent).detail));
    window.addEventListener("llfocus", onFocus);
    window.addEventListener("llcarousel", onCarousel);
    return () => {
      window.removeEventListener("llfocus", onFocus);
      window.removeEventListener("llcarousel", onCarousel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);

  const intro = phase === "intro";

  return (
    <>
      {/* Intro-Schleier über dem Tisch (Karte liegt DARÜBER) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: intro ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.33, 0.02, 0.18, 1] }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 80,
          background: "color-mix(in srgb, var(--surface) 82%, transparent)",
          backdropFilter: "blur(10px)",
          pointerEvents: intro ? "auto" : "none",
        }}
        onMouseMove={(e) => {
          mx.set(e.clientX / window.innerWidth - 0.5);
          my.set(e.clientY / window.innerHeight - 0.5);
        }}
      />

      {/* Die Karte */}
      <motion.div
        drag={!intro}
        dragMomentum
        dragElastic={0.14}
        dragConstraints={bounds}
        whileDrag={{ scale: 1.05, rotate: -1.5 }}
        onDragStart={() => {
          window.dispatchEvent(new CustomEvent("llcursor", { detail: "grab" }));
        }}
        onDragEnd={() => {
          window.dispatchEvent(new CustomEvent("llcursor", { detail: "open" }));
        }}
        onPointerDown={(e) => {
          tapRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
        }}
        onPointerUp={(e) => {
          // Eigene Tap-Erkennung — unabhängig von Framer-Gesten, damit der
          // Flip auch nach beliebig vielen Drags zuverlässig bleibt
          const tp = tapRef.current;
          if (
            !intro &&
            tp &&
            Math.hypot(e.clientX - tp.x, e.clientY - tp.y) < 7 &&
            performance.now() - tp.t < 450
          ) {
            setFlipped((f) => !f);
          }
          tapRef.current = null;
        }}
        animate={{
          scale: focusedProject ? 0.82 : 1,
          // Vollansicht (Karussell) hat die Bühne für sich — Karte ganz weg;
          // beim Fan-Out tritt sie in die Tiefenunschärfe zurück
          opacity: carouselOpen ? 0 : focusedProject ? (hideOnMobile ? 0 : 0.3) : 1,
          filter: focusedProject && !carouselOpen && !hideOnMobile ? "blur(2.5px) saturate(0.8)" : "blur(0px) saturate(1)",
        }}
        transition={spring}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x,
          y,
          width: w,
          zIndex: intro ? 86 : 72,
          aspectRatio: "85 / 52",
          perspective: 1100,
          containerType: "inline-size",
          pointerEvents: carouselOpen || (hideOnMobile && focusedProject) ? "none" : "auto",
        }}
        role={intro ? undefined : "button"}
        aria-label="Visitenkarte"
        data-flipped={flipped}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 19 }}
          style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}
        >
          {/* Vorderseite */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              rotateX: intro ? rx : 0,
              rotateY: intro ? ry : 0,
              background: "var(--paper)",
              borderRadius: "5.5cqw",
              boxShadow: intro
                ? "0 40px 90px rgba(120,60,170,0.30), 0 8px 24px rgba(150,80,200,0.18)"
                : "var(--shadow-card)",
              border: "0.5px solid var(--paper-edge)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "8cqw 9cqw",
            }}
          >
            <img
              src="/brand/logo/wordmark-black.png"
              alt="LeifLike Design"
              style={{ width: "56cqw", objectFit: "contain", alignSelf: "flex-start" }}
              draggable={false}
            />
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "3cqw" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--ink-900)", fontSize: "6.4cqw", lineHeight: 1.1 }}>
                  {profile.name}
                </div>
                <div style={{ fontSize: "3.5cqw", color: "var(--ink-500)", fontWeight: 600, letterSpacing: "0.04em", marginTop: "1.6cqw", whiteSpace: "nowrap" }}>
                  Design&ensp;|&ensp;Illustration&ensp;|&ensp;Fotografie
                </div>
              </div>
              <div style={{ display: "flex", gap: "2.2cqw", paddingBottom: "1cqw", flexShrink: 0 }}>
                {["#ff95f9", "#c950ff", "#a093ff", "#17121c"].map((c) => (
                  <span key={c} style={{ width: "2.8cqw", height: "2.8cqw", borderRadius: "50%", background: c, opacity: 0.85 }} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Rückseite — Kontakt */}
          <div
            className="ll-flow"
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: "5.5cqw",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "3cqw",
                padding: "8cqw 9cqw",
                color: "#fff",
              }}
            >
              <div style={{ fontFamily: "var(--font-groovy)", fontSize: "8.2cqw", lineHeight: 1, textShadow: "0 4px 24px rgba(80,20,120,0.3)" }}>
                {t("getInTouch")}
              </div>
              <a
                href={`mailto:${profile.email}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: "#fff", fontWeight: 700, fontSize: "4.6cqw", textDecoration: "none" }}
              >
                {profile.email}
              </a>
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: "#fff", fontWeight: 600, fontSize: "4.2cqw", textDecoration: "none", opacity: 0.92 }}
              >
                Instagram ↗
              </a>
              <div style={{ fontSize: "3.6cqw", opacity: 0.85, marginTop: "1cqw", fontStyle: "italic" }}>
                Danke fürs Vorbeischauen.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tagline unter der Intro-Karte — sauber zentriert */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: intro ? 1 : 0, y: intro ? 0 : 8 }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.33, 0.02, 0.18, 1] }}
        style={{
          position: "fixed",
          zIndex: 82,
          left: 0,
          right: 0,
          top: "calc(44% + min(175px, 36vw))",
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(0.95rem, 2.2vw, 1.25rem)",
          color: "var(--text-body)",
          pointerEvents: "none",
          padding: "0 16px",
        }}
      >
        {t("tagline")}
      </motion.div>
    </>
  );
}
