"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "open" | "grab" | "point" | "hidden";

const stroke = { fill: "var(--paper)", stroke: "var(--ink-900)", strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/**
 * Illustrierter Hand-Cursor: offen über dem Tisch, greift beim Ziehen zu,
 * zeigt mit dem Zeigefinger auf Stapel. Drei gezeichnete Hände, Crossfade.
 */
export function HandCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("hidden");
  const pos = useRef({ x: -100, y: -100, tx: -100, ty: -100 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.35;
      p.y += (p.ty - p.y) * 0.35;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${p.x - 22}px, ${p.y - 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let dragging = false;
    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      if (dragging) return; // Greif-Zustand hält, bis losgelassen wird
      const el = e.target as HTMLElement;
      if (!el.closest("[data-hand-zone]") || el.closest("input, textarea, select")) {
        setState("hidden");
      } else if (el.closest('button, a, [data-slug], [role="button"], .ll-paper')) {
        setState("point");
      } else {
        setState("open");
      }
    };
    const onCursor = (e: Event) => {
      const detail = (e as CustomEvent).detail as CursorState;
      dragging = detail === "grab";
      setState((s) => (s === "hidden" && detail !== "grab" ? s : detail));
    };
    const onLeave = () => setState("hidden");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("llcursor", onCursor);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("llcursor", onCursor);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const vis = (s: CursorState) => ({ opacity: state === s ? 1 : 0, transition: "opacity 130ms var(--ease-flow)" });

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 200,
        pointerEvents: "none",
        opacity: state === "hidden" ? 0 : 1,
        transition: "opacity 180ms var(--ease-flow)",
        filter: "drop-shadow(0 3px 6px rgba(120,60,160,0.28))",
      }}
    >
      <div
        style={{
          transform:
            state === "grab" ? "rotate(-8deg) scale(0.9)" : state === "point" ? "rotate(3deg)" : "none",
          transition: "transform 170ms var(--ease-pop)",
        }}
      >
        <svg width="46" height="48" viewBox="0 0 46 48" style={{ position: "absolute", ...vis("open") }}>
          {/* Offene Hand: Handfläche + 4 Finger + Daumen */}
          <path
            d="M14,27 L14,12 Q14,8.5 16.75,8.5 Q19.5,8.5 19.5,12 L19.5,19
               L21,19 L21,8 Q21,4.5 23.75,4.5 Q26.5,4.5 26.5,8 L26.5,18.5
               L28,18.5 L28,10 Q28,6.5 30.5,6.5 Q33,6.5 33,10 L33,19.5
               L34.5,19.5 L34.5,14 Q34.5,11 36.75,11 Q39,11 39,14
               L39,28 Q39,38 30,41.5 Q18,44.5 14,34 Z"
            {...stroke}
          />
          <path d="M14.5,29 Q6,26 7.5,21.5 Q9,17.5 15,20.5 L16,21.5" {...stroke} />
        </svg>

        <svg width="46" height="48" viewBox="0 0 46 48" style={{ position: "absolute", ...vis("point") }}>
          {/* Zeigen: Faust mit ausgestrecktem Zeigefinger */}
          <path
            d="M14,24 Q14,20 17,19 L15.5,19 L15.5,8 Q15.5,4.5 18.25,4.5 Q21,4.5 21,8 L21,18
               L36,19 Q39,20 39,24 L39,30 Q39,38 30.5,41 Q19,43.5 14,34 Z"
            {...stroke}
          />
          {/* der Zeigefinger, betont */}
          <path
            d="M15.5,18 L15.5,8 Q15.5,4.5 18.25,4.5 Q21,4.5 21,8 L21,18"
            fill="var(--paper)"
            stroke="var(--violet-500)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <g stroke="var(--ink-900)" strokeWidth="1.5" strokeLinecap="round" opacity="0.55">
            <path d="M25,20 L25,25" />
            <path d="M30,20 L30,25" />
            <path d="M35,21 L35,25.5" />
          </g>
        </svg>

        <svg width="46" height="48" viewBox="0 0 46 48" style={{ position: "absolute", ...vis("grab") }}>
          {/* Faust */}
          <path d="M13,23 Q13,17 18,16 L34,16 Q39,17 39,23 L39,31 Q39,39 30.5,41.5 Q18,43.5 14,34 Z" {...stroke} />
          <g stroke="var(--ink-900)" strokeWidth="1.6" strokeLinecap="round" opacity="0.6">
            <path d="M20,16 L20,22" />
            <path d="M26,16 L26,22" />
            <path d="M32,16 L32,22" />
          </g>
          <path d="M13,27 Q10,31 14.5,33 Q19,35 21,32.5" {...stroke} />
        </svg>
      </div>
    </div>
  );
}
