"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { resolveSrc } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

interface Props {
  project: Project | null;
  startIndex: number;
  onClose: () => void;
}

/**
 * Vollansicht als Karussell: das aktive Bild groß in der Mitte,
 * die Nachbarn lugen seitlich herein. Scrollen, Pfeile, Swipe — alles blättert.
 */
export function Carousel({ project, startIndex, onClose }: Props) {
  const { t } = useI18n();
  const [idx, setIdx] = useState(startIndex);
  const wheelAcc = useRef(0);
  const n = project?.images.length ?? 0;

  useEffect(() => setIdx(startIndex), [startIndex, project]);

  const step = useCallback(
    (dir: number) => setIdx((i) => Math.max(0, Math.min(n - 1, i + dir))),
    [n]
  );

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
      e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [project, onClose, step]);

  if (!project) return null;

  const size = (im: { w: number; h: number }, big: boolean) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const maxW = big ? vw * 0.72 : vw * 0.2;
    const maxH = big ? vh * 0.76 : vh * 0.42;
    const s = Math.min(maxW / im.w, maxH / im.h);
    return { w: im.w * s, h: im.h * s };
  };

  return (
    <AnimatePresence>
      <motion.div
        key="carousel"
        className="ll-carousel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onWheel={(e) => {
          e.stopPropagation();
          wheelAcc.current += e.deltaY + e.deltaX;
          if (Math.abs(wheelAcc.current) > 90) {
            step(Math.sign(wheelAcc.current));
            wheelAcc.current = 0;
          }
        }}
      >
        {project.images.map((im, i) => {
          const off = i - idx;
          if (Math.abs(off) > 2) return null;
          const big = off === 0;
          const { w, h } = size(im, big);
          const vw = window.innerWidth;
          const xPos = off * (big ? 0 : vw * 0.42) + (off === 0 ? 0 : off * (vw * 0.04));
          return (
            <motion.div
              key={im.src}
              className="ll-carousel-img"
              initial={false}
              animate={{
                x: xPos,
                width: w,
                height: h,
                opacity: big ? 1 : 0.45,
                scale: big ? 1 : 0.92,
                rotate: big ? 0 : off * 1.6,
                zIndex: big ? 2 : 1,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (!big) step(off > 0 ? 1 : -1);
              }}
              style={{ cursor: big ? "default" : "pointer" }}
            >
              <img src={resolveSrc(im.src)} alt="" draggable={false} loading="eager" />
            </motion.div>
          );
        })}

        {idx > 0 && (
          <button className="ll-carousel-btn" style={{ left: 18 }} onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Zurück">
            ←
          </button>
        )}
        {idx < n - 1 && (
          <button className="ll-carousel-btn" style={{ right: 18 }} onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Weiter">
            →
          </button>
        )}
        <button
          className="ll-carousel-btn"
          style={{ top: 22, right: 18, translate: "0 0", width: 40, height: 40 }}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Schließen"
        >
          ×
        </button>

        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--text-mut)",
            pointerEvents: "none",
          }}
        >
          {idx + 1} / {n} · {t("carouselHint")}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
