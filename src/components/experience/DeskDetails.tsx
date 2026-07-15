"use client";

import { useState } from "react";
import type { DeskNote } from "@/lib/types";

export const noteColors: Record<DeskNote["color"], { bg: string; ink: string; label: string }> = {
  sun: { bg: "linear-gradient(180deg, #ffec8f 0%, #f6dd72 100%)", ink: "#6b5410", label: "Sonnengelb" },
  rose: { bg: "linear-gradient(180deg, #ffdcfb 0%, #ffc4f6 100%)", ink: "#8a2f6e", label: "Rosa" },
  sky: { bg: "linear-gradient(180deg, #dff1fd 0%, #c5e6fa 100%)", ink: "#1c5a80", label: "Himmelblau" },
  lavender: { bg: "linear-gradient(180deg, #f0dcff 0%, #e2c6fb 100%)", ink: "#5e2d8a", label: "Lavendel" },
};

export const noteFonts: Record<DeskNote["font"], { css: string; size: number; label: string }> = {
  hand: { css: "var(--font-groovy)", size: 19, label: "Handschrift" },
  serif: { css: "var(--font-display)", size: 15, label: "Serifen" },
  sans: { css: "var(--font-body)", size: 14.5, label: "Klar" },
};

/** Ein Post-it auf dem Tisch — klick, und es wackelt kurz. */
function Note({ note }: { note: DeskNote }) {
  const [wiggle, setWiggle] = useState(0);
  const c = noteColors[note.color] ?? noteColors.sun;
  const f = noteFonts[note.font] ?? noteFonts.hand;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setWiggle((w) => w + 1);
      }}
      aria-label="Notiz"
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        width: 168,
        minHeight: 150,
        border: "none",
        cursor: "pointer",
        background: c.bg,
        transform: `rotate(${note.rot}deg)`,
        boxShadow: "0 10px 22px rgba(120, 60, 160, 0.22), 0 2px 5px rgba(60,30,80,0.14)",
        borderRadius: "2px 2px 3px 2px",
        padding: "32px 14px 14px",
        fontFamily: f.css,
        fontSize: f.size,
        fontWeight: note.font === "sans" ? 600 : undefined,
        fontStyle: note.font === "sans" ? "italic" : undefined,
        lineHeight: 1.3,
        color: c.ink,
        textAlign: "left",
        whiteSpace: "pre-line",
        clipPath: "polygon(0 0, 100% 0, 100% 88%, 90% 100%, 0 100%)",
        animation: wiggle ? "note-wiggle 450ms var(--ease-pop)" : undefined,
      }}
      onAnimationEnd={() => setWiggle(0)}
    >
      {note.text}
      <span
        style={{
          position: "absolute",
          top: -8,
          left: "28%",
          width: "44%",
          height: 20,
          background: "rgba(255,255,255,0.5)",
          transform: "rotate(-1.5deg)",
          boxShadow: "0 1px 2px rgba(60,30,80,0.08)",
        }}
      />
      <span
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 20,
          height: 20,
          background: "rgba(60, 40, 20, 0.14)",
          clipPath: "polygon(0 100%, 100% 0, 100% 100%)",
        }}
      />
    </button>
  );
}

export function NotesLayer({ notes, dimmed }: { notes: DeskNote[]; dimmed: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: dimmed ? "none" : "auto",
        opacity: dimmed ? 0.28 : 1,
        filter: dimmed ? "blur(2.5px) saturate(0.8)" : "none",
        transition: "opacity 480ms var(--ease-flow), filter 480ms var(--ease-flow)",
      }}
    >
      {notes.map((n) => (
        <Note key={n.id} note={n} />
      ))}
      <style>{`@keyframes note-wiggle {
        0% { rotate: 0deg; } 30% { rotate: 3deg; } 60% { rotate: -2.2deg; } 100% { rotate: 0deg; }
      }`}</style>
    </div>
  );
}

export interface Doodle {
  x: number;
  y: number;
  kind: number;
  seed: number;
}

/**
 * Handgemalte Kritzeleien — wacklige Linien, offene Enden, Überschwung.
 * Erscheinen per Doppelklick und zeichnen sich wie mit dem Stift.
 */
const doodlePaths = [
  // Stern, schwungvoll & schief
  "M20,4 C21.5,10 23,13.5 25,15 C29,15.5 32.5,15.5 36,16 C33,19 30.5,21 28,23.5 C29,27.5 30,31 30.5,35.5 C27,33 23.5,30.8 20.5,29 C17,31.5 13.8,33.8 10.5,36 C11.5,31.5 12.4,28 13,24 C10,21.5 7,19.3 4.5,16.5 C8.5,16 12,15.6 15.5,15 C17,11.5 18.2,8 20,4 Z M19.7,4.6 C20.2,6.8 20.8,9 21.6,11.4",
  // Herz mit doppeltem Anstrich
  "M20,33 C10,25.5 4.5,18.5 6.5,12 C8.2,7 14,5.8 17.5,9 C18.8,10.2 19.6,11.6 20,13 C20.5,11.5 21.4,10 22.8,8.8 C26.3,5.8 32,7.2 33.6,12.2 C35.5,18.6 30,25.6 20.4,32.8 M19.4,32 C15,28.6 11,25.2 8.4,21.6",
  // Blume: fünf lose Bögen um eine Mitte
  "M20,15 C17,9 21,4.5 24,7 C27,9.5 24.5,14 21,15.5 M24,17 C30,14 34.5,18 32,21 C29.5,24 24.6,21.8 23,18.5 M22,22.5 C25,28 21,32.5 18,30 C15,27.5 17.4,23 21,21.5 M17,20 C11,23 6.5,19 9,16 C11.5,13 16.4,15.2 18,18.5 M18.5,17.5 C19.5,17 20.5,17 21.5,17.6 C22.3,18.4 22.4,19.6 21.8,20.5 C21,21.4 19.6,21.4 18.8,20.6 C18,19.7 18,18.4 18.5,17.5",
  // Blitz, kantig mit Überschwung
  "M24.5,3.5 C20,10 15.5,16 11,22.5 C13.8,22.7 16.5,22.8 19.3,23 C17.5,28 15.8,33 14.2,38.5 C19.8,31.5 25.3,24.8 30.8,17.8 C27.8,17.5 25,17.3 22,17 C23,12.6 23.8,8.2 24.5,3.5 Z",
];

export function DoodleLayer({ doodles }: { doodles: Doodle[] }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }} aria-hidden>
      {doodles.map((d, i) => (
        <g
          key={i}
          transform={`translate(${d.x - 60}, ${d.y - 60}) scale(3) rotate(${(d.seed % 36) - 18} 20 20)`}
        >
          <path
            d={doodlePaths[d.kind % doodlePaths.length]}
            fill="none"
            stroke="var(--pencil)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
            style={{
              strokeDasharray: 340,
              strokeDashoffset: 340,
              animation: "doodle-draw 1100ms var(--ease-flow) forwards",
            }}
          />
        </g>
      ))}
      <style>{`@keyframes doodle-draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}
