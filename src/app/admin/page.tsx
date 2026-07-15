"use client";

import { useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import Link from "next/link";
import { WORLD } from "@/lib/seed";
import {
  useAppData,
  useSaveState,
  getData,
  setData,
  resetData,
  ensureHydrated,
  uploadImage,
  resolveSrc,
  login,
  logout,
  checkAuth,
} from "@/lib/store";
import type { AppData, CVEntry, L10n, Project } from "@/lib/types";
import { useTheme } from "@/lib/theme";
import { WatermarkLayer } from "@/components/experience/WatermarkLayer";

/* ---------------- Hilfen ---------------- */

function update(fn: (d: AppData) => void) {
  const next = structuredClone(getData());
  fn(next);
  setData(next);
}

function L10nField({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: L10n | undefined;
  onChange: (v: L10n) => void;
  area?: boolean;
}) {
  const v = value ?? { de: "", en: "" };
  const Cmp = (area ? "textarea" : "input") as "input";
  return (
    <div className="ll-l10n">
      <div className="ll-field">
        <label>
          <span className="ll-lang-badge" data-lang="de">DE</span>
          {label}
        </label>
        <Cmp value={v.de} onChange={(e) => onChange({ ...v, de: e.target.value })} />
      </div>
      <div className="ll-field">
        <label>
          <span className="ll-lang-badge" data-lang="en">EN</span>
          {label}
        </label>
        <Cmp value={v.en} onChange={(e) => onChange({ ...v, en: e.target.value })} />
      </div>
    </div>
  );
}

const kindColors: Record<string, string> = {
  bildung: "#a093ff",
  taetigkeit: "#c950ff",
  engagement: "#ff95f9",
};
const kindLabels: Record<string, string> = {
  bildung: "Bildung",
  taetigkeit: "Tätigkeit",
  engagement: "Engagement",
};

/* ---------------- Login-Gate (lokal; Supabase folgt per ENV) ---------------- */

function Gate({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--surface)" }}>
      <form
        className="ll-admin-card"
        style={{ width: "min(380px, 90vw)" }}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const ok = await login(pw);
          setBusy(false);
          if (ok) onOk();
          else setErr(true);
        }}
      >
        <img src="/brand/logo/wordmark-black.png" alt="LeifLike" className="ll-invert-dark" style={{ width: 150, marginBottom: 18 }} />
        <h2 style={{ fontSize: "1.4rem" }}>Admin</h2>
        <div className="ll-field">
          <label>Passwort</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setErr(false);
            }}
            autoFocus
          />
        </div>
        {err && <p style={{ color: "#c0392b", fontSize: "0.85rem" }}>Falsches Passwort.</p>}
        <button className="ll-btn" type="submit" disabled={busy}>
          {busy ? "Prüfe…" : "Anmelden"}
        </button>
        <p style={{ fontSize: "0.78rem", color: "var(--text-mut)", marginTop: 14, marginBottom: 0 }}>
          Das Passwort liegt serverseitig in <code>ADMIN_PASSWORD</code>. Änderungen speichert der Server —
          jeder Besucher sieht sie sofort.
        </p>
      </form>
    </div>
  );
}

/* ---------------- Projekt-Editor ---------------- */

function ImageStrip({ project }: { project: Project }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      try {
        const { src, w, h } = await uploadImage(file);
        update((d) => {
          d.projects.find((p) => p.slug === project.slug)?.images.push({ src, w, h });
        });
      } catch (err) {
        alert(`Upload fehlgeschlagen: ${(err as Error).message}`);
      }
    }
    setBusy(false);
  };

  return (
    <div>
      <Reorder.Group
        axis="x"
        values={project.images.map((i) => i.src)}
        onReorder={(order: string[]) =>
          update((d) => {
            const p = d.projects.find((q) => q.slug === project.slug)!;
            p.images = order.map((src) => p.images.find((i) => i.src === src)!);
          })
        }
        style={{ display: "flex", gap: 10, listStyle: "none", padding: 0, margin: "0 0 10px", overflowX: "auto" }}
      >
        {project.images.map((im) => (
          <Reorder.Item
            key={im.src}
            value={im.src}
            style={{ position: "relative", flex: "0 0 auto", cursor: "grab" }}
            whileDrag={{ scale: 1.06 }}
          >
            <img
              src={resolveSrc(im.src)}
              alt=""
              style={{ height: 74, borderRadius: 6, display: "block", boxShadow: "var(--shadow-paper)" }}
              draggable={false}
            />
            <button
              onClick={() =>
                update((d) => {
                  const p = d.projects.find((q) => q.slug === project.slug)!;
                  p.images = p.images.filter((i) => i.src !== im.src);
                })
              }
              aria-label="Bild entfernen"
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "none",
                background: "var(--ink-900)",
                color: "#fff",
                fontSize: 11,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      <button className="ll-btn ll-btn-ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
        {busy ? "Lade hoch…" : "+ Bilder hochladen (WebP)"}
      </button>
    </div>
  );
}

function ProjectEditor({ project }: { project: Project }) {
  const set = (fn: (p: Project) => void) =>
    update((d) => {
      const p = d.projects.find((q) => q.slug === project.slug);
      if (p) fn(p);
    });

  return (
    <div style={{ paddingTop: 14, display: "grid", gap: 4 }}>
      <L10nField label="Titel" value={project.title} onChange={(v) => set((p) => (p.title = v))} />
      <L10nField label="Umfang" value={project.scope} onChange={(v) => set((p) => (p.scope = v))} area />
      <L10nField label="Kund:in" value={project.client} onChange={(v) => set((p) => (p.client = v))} />
      <L10nField label="Notiz" value={project.note} onChange={(v) => set((p) => (p.note = v))} area />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div className="ll-field">
          <label>Jahr</label>
          <input value={project.year ?? ""} onChange={(e) => set((p) => (p.year = e.target.value || undefined))} />
        </div>
        <div className="ll-field">
          <label>Kategorie</label>
          <select
            value={project.category}
            onChange={(e) => set((p) => (p.category = e.target.value as Project["category"]))}
          >
            <option value="design">Design</option>
            <option value="illustration">Illustration</option>
            <option value="fotografie">Fotografie</option>
          </select>
        </div>
        <div className="ll-field">
          <label>Rotation (°)</label>
          <input
            type="number"
            value={project.rot}
            onChange={(e) => set((p) => (p.rot = Number(e.target.value) || 0))}
          />
        </div>
      </div>
      <ImageStrip project={project} />
      <div style={{ marginTop: 12 }}>
        <button
          className="ll-btn ll-btn-danger"
          onClick={() => {
            if (confirm(`„${project.title.de}“ wirklich löschen?`)) {
              update((d) => (d.projects = d.projects.filter((p) => p.slug !== project.slug)));
            }
          }}
        >
          Projekt löschen
        </button>
      </div>
    </div>
  );
}

function ProjectsTab() {
  const { projects } = useAppData();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <p style={{ color: "var(--text-mut)", fontSize: "0.9rem" }}>
        Reihenfolge = Scroll-Pfad auf dem Tisch. Ziehen zum Sortieren, klicken zum Bearbeiten.
      </p>
      <Reorder.Group
        axis="y"
        values={projects.map((p) => p.slug)}
        onReorder={(order: string[]) =>
          update((d) => {
            d.projects = order.map((slug) => d.projects.find((p) => p.slug === slug)!);
          })
        }
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {projects.map((p) => (
          <Reorder.Item key={p.slug} value={p.slug} whileDrag={{ scale: 1.01 }}>
            <div className="ll-admin-card" style={{ cursor: "grab" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: 14 }}
                onClick={() => setOpen(open === p.slug ? null : p.slug)}
              >
                <span style={{ color: "var(--text-faint)", fontWeight: 700, cursor: "grab" }}>⠿</span>
                {p.images[0] && (
                  <img
                    src={resolveSrc(p.images[0].src)}
                    alt=""
                    style={{ width: 52, height: 38, objectFit: "cover", borderRadius: 5 }}
                  />
                )}
                <strong style={{ flex: 1, color: "var(--text-strong)" }}>{p.title.de}</strong>
                <span className="ll-tag">{p.category}</span>
                <span style={{ color: "var(--text-faint)" }}>{open === p.slug ? "▲" : "▼"}</span>
              </div>
              {open === p.slug && <ProjectEditor project={p} />}
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <button
        className="ll-btn"
        onClick={() => {
          const slug = `projekt-${Date.now().toString(36)}`;
          update((d) =>
            d.projects.push({
              slug,
              title: { de: "Neues Projekt", en: "New project" },
              category: "design",
              images: [],
              x: WORLD.w / 2,
              y: WORLD.h / 2,
              rot: 0,
            })
          );
          setOpen(slug);
        }}
      >
        + Neues Projekt
      </button>
    </div>
  );
}

/* ---------------- Tisch (Mini-Map) ---------------- */

const textures: { id: string; label: string }[] = [
  { id: "dots", label: "Punktraster" },
  { id: "paper", label: "Papierkorn" },
  { id: "grid", label: "Raster" },
  { id: "linen", label: "Leinen" },
  { id: "plain", label: "Glatt" },
];

const wmLogos: { id: string; label: string; file: string; basePct: number }[] = [
  { id: "mono", label: "Monogramm", file: "mono-L-black.png", basePct: 8.5 },
  { id: "badge", label: "Badge", file: "badge-L.png", basePct: 8.5 },
  { id: "wordmark", label: "Wortmarke", file: "wordmark-black.png", basePct: 15 },
  { id: "stacked", label: "Gestapelt", file: "wordmark-stacked-tint.png", basePct: 10 },
];

const noteColorOpts = [
  { id: "sun", label: "Sonnengelb" },
  { id: "rose", label: "Rosa" },
  { id: "sky", label: "Himmelblau" },
  { id: "lavender", label: "Lavendel" },
];
const noteFontOpts = [
  { id: "hand", label: "Handschrift" },
  { id: "serif", label: "Serifen" },
  { id: "sans", label: "Klar" },
];

function TableTab() {
  const { projects, settings, notes } = useAppData();
  const mapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ kind: "stack" | "note"; id: string } | null>(null);
  const wm = settings?.watermark ?? { enabled: false, logo: "mono" as const, opacity: 0.07, size: 1, density: 1 };

  const setWm = (patch: Partial<typeof wm>) =>
    update((d) => (d.settings = { ...d.settings, watermark: { ...d.settings.watermark, ...patch } }));

  const toWorld = (e: React.PointerEvent) => {
    const r = mapRef.current!.getBoundingClientRect();
    return {
      x: Math.max(160, Math.min(WORLD.w - 160, ((e.clientX - r.left) / r.width) * WORLD.w)),
      y: Math.max(140, Math.min(WORLD.h - 140, ((e.clientY - r.top) / r.height) * WORLD.h)),
    };
  };

  return (
    <div>
      <div className="ll-admin-card">
        <h3 style={{ marginBottom: 4 }}>Tisch-Oberfläche</h3>
        <p style={{ color: "var(--text-mut)", fontSize: "0.85rem", marginBottom: 14 }}>
          Textur und Wasserzeichen liegen in der Welt und wandern beim Navigieren echt mit.
          Die Vorschau unten zeigt alles live — die Lampe oben wechselt Tag/Nacht.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
          {textures.map((tx) => (
            <button
              key={tx.id}
              className="ll-tex-option"
              data-active={(settings?.texture ?? "dots") === tx.id}
              onClick={() => update((d) => (d.settings = { ...d.settings, texture: tx.id as AppData["settings"]["texture"] }))}
            >
              <span className="ll-texture" data-texture={tx.id} style={{ position: "absolute", inset: 0 }} />
              <span>{tx.label}</span>
            </button>
          ))}
        </div>

        <h3 style={{ marginBottom: 4, fontSize: "1.05rem" }}>Logo-Wasserzeichen</h3>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={wm.enabled}
              onChange={(e) => setWm({ enabled: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            aktiv
          </label>
          <div className="ll-field" style={{ width: 150, marginBottom: 0 }}>
            <label>Logo</label>
            <select value={wm.logo} onChange={(e) => setWm({ logo: e.target.value as typeof wm.logo })}>
              {wmLogos.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="ll-field" style={{ width: 160, marginBottom: 0 }}>
            <label>Transparenz · {Math.round(wm.opacity * 100)}%</label>
            <input
              type="range"
              min={2}
              max={30}
              value={Math.round(wm.opacity * 100)}
              onChange={(e) => setWm({ opacity: Number(e.target.value) / 100 })}
            />
          </div>
          <div className="ll-field" style={{ width: 160, marginBottom: 0 }}>
            <label>Größe · {(wm.size ?? 1).toFixed(1)}×</label>
            <input
              type="range"
              min={5}
              max={20}
              value={Math.round((wm.size ?? 1) * 10)}
              onChange={(e) => setWm({ size: Number(e.target.value) / 10 })}
            />
          </div>
          <div className="ll-field" style={{ width: 160, marginBottom: 0 }}>
            <label>Dichte · {wm.density.toFixed(1)}×</label>
            <input
              type="range"
              min={5}
              max={20}
              value={Math.round(wm.density * 10)}
              onChange={(e) => setWm({ density: Number(e.target.value) / 10 })}
            />
          </div>
        </div>
      </div>

      <p style={{ color: "var(--text-mut)", fontSize: "0.9rem" }}>
        Der ganze Tisch aus der Vogelperspektive — Stapel und Notizen frei verschieben. Die Linie ist der Scroll-Pfad.
      </p>
      <div
        ref={mapRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: `${WORLD.w} / ${WORLD.h}`,
          background: "var(--surface-raised)",
          border: "1.5px solid var(--line)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          touchAction: "none",
        }}
        onPointerMove={(e) => {
          const drag = dragging.current;
          if (!drag) return;
          const { x, y } = toWorld(e);
          update((d) => {
            if (drag.kind === "stack") {
              const p = d.projects.find((q) => q.slug === drag.id);
              if (p) {
                p.x = Math.round(x);
                p.y = Math.round(y);
              }
            } else {
              const n = d.notes.find((q) => q.id === drag.id);
              if (n) {
                n.x = Math.round(x);
                n.y = Math.round(y);
              }
            }
          });
        }}
        onPointerUp={() => (dragging.current = null)}
      >
        {/* Live-Vorschau: Textur + Wasserzeichen wie auf dem echten Tisch */}
        <span className="ll-texture" data-texture={settings?.texture ?? "dots"} style={{ position: "absolute", inset: 0 }} />
        <WatermarkLayer wm={wm} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} preserveAspectRatio="none">
          <polyline
            points={projects.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="var(--pencil)"
            strokeWidth={8}
            strokeDasharray="4 26"
            strokeLinecap="round"
            opacity={0.5}
          />
        </svg>
        {(notes ?? []).map((n) => (
          <div
            key={n.id}
            onPointerDown={(e) => {
              e.preventDefault();
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              dragging.current = { kind: "note", id: n.id };
            }}
            title={n.text.split("\n")[0]}
            style={{
              position: "absolute",
              left: `${(n.x / WORLD.w) * 100}%`,
              top: `${(n.y / WORLD.h) * 100}%`,
              translate: "-50% -50%",
              width: 18,
              height: 18,
              borderRadius: 2,
              background:
                n.color === "rose" ? "#ffc4f6" : n.color === "sky" ? "#c5e6fa" : n.color === "lavender" ? "#e2c6fb" : "#f6dd72",
              transform: `rotate(${n.rot}deg)`,
              boxShadow: "var(--shadow-paper)",
              cursor: "grab",
              border: "1px solid rgba(60,30,80,0.25)",
            }}
          />
        ))}
        {projects.map((p, i) => (
          <div
            key={p.slug}
            onPointerDown={(e) => {
              e.preventDefault();
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              dragging.current = { kind: "stack", id: p.slug };
            }}
            title={p.title.de}
            style={{
              position: "absolute",
              left: `${(p.x / WORLD.w) * 100}%`,
              top: `${(p.y / WORLD.h) * 100}%`,
              translate: "-50% -50%",
              width: 44,
              height: 34,
              borderRadius: 4,
              background: "var(--paper)",
              boxShadow: "var(--shadow-paper)",
              transform: `rotate(${p.rot}deg)`,
              cursor: "grab",
              overflow: "hidden",
              border: "1px solid var(--line)",
            }}
          >
            {p.images[0] && (
              <img src={resolveSrc(p.images[0].src)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} draggable={false} />
            )}
            <span
              style={{
                position: "absolute",
                left: 2,
                top: 0,
                fontSize: 10,
                fontWeight: 800,
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,0.7)",
              }}
            >
              {i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Notizen bearbeiten */}
      <div className="ll-admin-card" style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 4 }}>Notizen auf dem Tisch</h3>
        <p style={{ color: "var(--text-mut)", fontSize: "0.85rem", marginBottom: 14 }}>
          Die kleinen Zettel oben in der Karte lassen sich dort verschieben — hier bearbeiten.
        </p>
        {(notes ?? []).map((n, i) => (
          <div key={n.id} className="ll-cv-entry" style={{ borderLeftColor: n.color === "rose" ? "#ff95f9" : n.color === "sky" ? "#7cc0e8" : n.color === "lavender" ? "#c98ff5" : "#e8c94f" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 8 }}>
              <div className="ll-field" style={{ width: 150, marginBottom: 0 }}>
                <label>Farbe</label>
                <select value={n.color} onChange={(e) => update((d) => (d.notes[i].color = e.target.value as typeof n.color))}>
                  {noteColorOpts.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="ll-field" style={{ width: 150, marginBottom: 0 }}>
                <label>Schrift</label>
                <select value={n.font} onChange={(e) => update((d) => (d.notes[i].font = e.target.value as typeof n.font))}>
                  {noteFontOpts.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="ll-field" style={{ width: 110, marginBottom: 0 }}>
                <label>Drehung (°)</label>
                <input
                  type="number"
                  value={n.rot}
                  onChange={(e) => update((d) => (d.notes[i].rot = Number(e.target.value) || 0))}
                />
              </div>
              <div style={{ flex: 1 }} />
              <button
                className="ll-btn ll-btn-ghost"
                style={{ padding: "0.4em 0.7em" }}
                onClick={() => update((d) => d.notes.splice(i, 1))}
              >
                ×
              </button>
            </div>
            <div className="ll-field" style={{ marginBottom: 0 }}>
              <label>Text</label>
              <textarea
                value={n.text}
                rows={3}
                onChange={(e) => update((d) => (d.notes[i].text = e.target.value))}
              />
            </div>
          </div>
        ))}
        <button
          className="ll-btn"
          onClick={() =>
            update((d) =>
              d.notes.push({
                id: `note-${Date.now().toString(36)}`,
                x: WORLD.w / 2,
                y: WORLD.h / 2,
                rot: -4,
                text: "Neue Notiz",
                color: "sun",
                font: "hand",
              })
            )
          }
        >
          + Notiz
        </button>
      </div>
    </div>
  );
}

/* ---------------- Über mich ---------------- */

function PortraitEditor() {
  const { profile } = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const focus = profile.portraitFocus ?? { x: 60, y: 30 };

  const setFocus = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)));
    update((d) => (d.profile.portraitFocus = { x, y }));
  };

  if (!profile.portrait) return null;
  const src = resolveSrc(profile.portrait.src);

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 18 }}>
      <div>
        <p className="ll-dt" style={{ marginBottom: 6 }}>Portrait — Fokuspunkt setzen (klicken/ziehen)</p>
        <div
          style={{ position: "relative", width: 280, cursor: "crosshair", touchAction: "none", borderRadius: 8, overflow: "hidden", boxShadow: "var(--shadow-paper)" }}
          onPointerDown={(e) => {
            dragRef.current = true;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setFocus(e);
          }}
          onPointerMove={(e) => dragRef.current && setFocus(e)}
          onPointerUp={() => (dragRef.current = false)}
        >
          <img src={src} alt="" style={{ display: "block", width: "100%" }} draggable={false} />
          <span
            style={{
              position: "absolute",
              left: `${focus.x}%`,
              top: `${focus.y}%`,
              translate: "-50% -50%",
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "3px solid #fff",
              boxShadow: "0 0 0 2px var(--violet-500), 0 2px 8px rgba(0,0,0,0.35)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
      <div>
        <p className="ll-dt" style={{ marginBottom: 6 }}>Hochkant-Vorschau (schmale Screens)</p>
        <div style={{ width: 132, aspectRatio: "4 / 5", borderRadius: 8, overflow: "hidden", boxShadow: "var(--shadow-paper)" }}>
          <img
            src={src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${focus.x}% ${focus.y}%` }}
            draggable={false}
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            try {
              const { src, w, h } = await uploadImage(f);
              update((d) => (d.profile.portrait = { src, w, h }));
            } catch (err) {
              alert(`Upload fehlgeschlagen: ${(err as Error).message}`);
            } finally {
              setBusy(false);
            }
          }}
        />
        <button className="ll-btn ll-btn-ghost" style={{ marginTop: 12 }} disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Lade hoch…" : "Bild ersetzen"}
        </button>
      </div>
    </div>
  );
}

function AboutTab() {
  const { profile, cv } = useAppData();
  const setP = (fn: (p: AppData["profile"]) => void) => update((d) => fn(d.profile));

  return (
    <div>
      <div className="ll-admin-card">
        <h3>Profil</h3>
        <PortraitEditor />
        <div className="ll-field">
          <label>Name</label>
          <input value={profile.name} onChange={(e) => setP((p) => (p.name = e.target.value))} />
        </div>
        <L10nField label="Rolle" value={profile.role} onChange={(v) => setP((p) => (p.role = v))} />
        <L10nField label="Intro-Text" value={profile.intro} onChange={(v) => setP((p) => (p.intro = v))} area />
        <L10nField label="Tagline" value={profile.tagline} onChange={(v) => setP((p) => (p.tagline = v))} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div className="ll-field">
            <label>E-Mail</label>
            <input value={profile.email} onChange={(e) => setP((p) => (p.email = e.target.value))} />
          </div>
          <div className="ll-field">
            <label>Instagram-URL</label>
            <input value={profile.instagram} onChange={(e) => setP((p) => (p.instagram = e.target.value))} />
          </div>
          <div className="ll-field">
            <label>Werkzeuge (Komma-getrennt)</label>
            <input
              value={profile.tools.join(", ")}
              onChange={(e) => setP((p) => (p.tools = e.target.value.split(",").map((s) => s.trim()).filter(Boolean)))}
            />
          </div>
        </div>
      </div>

      <div className="ll-admin-card">
        <h3 style={{ marginBottom: 4 }}>Lebenslauf</h3>
        <p style={{ color: "var(--text-mut)", fontSize: "0.85rem", marginBottom: 16 }}>
          Kategorien färben die Punkte auf der Timeline: Bildung (blau), Tätigkeit (violett), Engagement (magenta).
        </p>
        {cv.map((entry, i) => (
          <div key={i} className="ll-cv-entry" style={{ borderLeftColor: kindColors[entry.kind] ?? "var(--line)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 8 }}>
              <div className="ll-field" style={{ width: 140, marginBottom: 0 }}>
                <label>Zeitraum</label>
                <input value={entry.year} onChange={(e) => update((d) => (d.cv[i].year = e.target.value))} />
              </div>
              <div className="ll-field" style={{ width: 160, marginBottom: 0 }}>
                <label>Kategorie</label>
                <select
                  value={entry.kind}
                  style={{ borderLeft: `5px solid ${kindColors[entry.kind] ?? "transparent"}` }}
                  onChange={(e) => update((d) => (d.cv[i].kind = e.target.value as CVEntry["kind"]))}
                >
                  {Object.entries(kindLabels).map(([k, lab]) => (
                    <option key={k} value={k}>{lab}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  className="ll-btn ll-btn-ghost"
                  style={{ padding: "0.4em 0.7em" }}
                  disabled={i === 0}
                  onClick={() => update((d) => d.cv.splice(i - 1, 0, d.cv.splice(i, 1)[0] as CVEntry))}
                >
                  ↑
                </button>
                <button
                  className="ll-btn ll-btn-ghost"
                  style={{ padding: "0.4em 0.7em" }}
                  disabled={i === cv.length - 1}
                  onClick={() => update((d) => d.cv.splice(i + 1, 0, d.cv.splice(i, 1)[0] as CVEntry))}
                >
                  ↓
                </button>
                <button
                  className="ll-btn ll-btn-ghost"
                  style={{ padding: "0.4em 0.7em" }}
                  onClick={() => update((d) => d.cv.splice(i, 1))}
                >
                  ×
                </button>
              </div>
            </div>
            <L10nField label="Titel" value={entry.title} onChange={(v) => update((d) => (d.cv[i].title = v))} />
            <L10nField label="Detail" value={entry.detail} onChange={(v) => update((d) => (d.cv[i].detail = v))} area />
          </div>
        ))}
        <button
          className="ll-btn"
          onClick={() =>
            update((d) =>
              d.cv.unshift({
                year: String(new Date().getFullYear()),
                kind: "taetigkeit",
                title: { de: "", en: "" },
                detail: { de: "", en: "" },
              })
            )
          }
        >
          + Eintrag
        </button>
      </div>
    </div>
  );
}

/* ---------------- Daten ---------------- */

function DataTab() {
  const data = useAppData();
  return (
    <div className="ll-admin-card">
      <h3>Daten</h3>
      <p style={{ color: "var(--text-mut)", fontSize: "0.9rem" }}>
        Inhalte liegen lokal in diesem Browser (localStorage + IndexedDB für Bilder). Export als JSON zum Sichern
        oder für den späteren Supabase-Import.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          className="ll-btn"
          onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "leiflike-inhalte.json";
            a.click();
          }}
        >
          Export JSON
        </button>
        <label className="ll-btn ll-btn-ghost" style={{ cursor: "pointer" }}>
          Import JSON
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                setData(JSON.parse(await f.text()));
              } catch {
                alert("Ungültige Datei.");
              }
            }}
          />
        </label>
        <button
          className="ll-btn ll-btn-danger"
          onClick={() => {
            if (confirm("Alle lokalen Änderungen verwerfen und auf den Seed zurücksetzen?")) resetData();
          }}
        >
          Auf Seed zurücksetzen
        </button>
      </div>
      <p style={{ color: "var(--text-mut)", fontSize: "0.8rem", marginTop: 16, marginBottom: 0 }}>
        Supabase: <code>NEXT_PUBLIC_SUPABASE_URL</code> + <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
        <code>.env.local</code> setzen — der Remote-Adapter (lib/remote.ts) übernimmt dann Auth, Datenbank und
        Storage, ohne dass sich an dieser Oberfläche etwas ändert.
      </p>
    </div>
  );
}

/* ---------------- Seite ---------------- */

const tabs = ["Projekte", "Tisch", "Über mich", "Daten"] as const;

const saveLabels: Record<string, string> = {
  idle: "",
  saving: "Speichere…",
  saved: "Gespeichert ✓",
  error: "Nicht gespeichert!",
  unauthorized: "Sitzung abgelaufen",
};

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Projekte");
  const { theme, toggle } = useTheme();
  const save = useSaveState();

  useEffect(() => {
    (async () => {
      const authed = await checkAuth();
      setOk(authed);
      await ensureHydrated();
      setReady(true);
    })();
  }, []);

  if (!ready) return null;
  if (!ok) return <Gate onOk={() => setOk(true)} />;

  return (
    <div className="ll-admin">
      <header style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <img src="/brand/logo/mono-L-black.png" alt="" className="ll-invert-dark" style={{ height: 38 }} />
        <h1 style={{ fontSize: "1.6rem", margin: 0 }}>Studio-Verwaltung</h1>
        <span
          style={{
            flex: 1,
            fontSize: "0.82rem",
            fontWeight: 600,
            color: save === "error" || save === "unauthorized" ? "#c0392b" : "var(--text-mut)",
            transition: "opacity var(--dur-med) var(--ease-flow)",
          }}
        >
          {saveLabels[save]}
        </span>
        <button className="ll-btn ll-btn-ghost" onClick={toggle}>
          {theme === "dark" ? "Licht an" : "Licht aus"}
        </button>
        <button
          className="ll-btn ll-btn-ghost"
          onClick={async () => {
            await logout();
            setOk(false);
          }}
        >
          Abmelden
        </button>
        <Link href="/" className="ll-btn" style={{ textDecoration: "none" }}>
          Zum Tisch →
        </Link>
      </header>

      <nav style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {tabs.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={tab === tb ? "ll-btn" : "ll-btn ll-btn-ghost"}
          >
            {tb}
          </button>
        ))}
      </nav>

      {tab === "Projekte" && <ProjectsTab />}
      {tab === "Tisch" && <TableTab />}
      {tab === "Über mich" && <AboutTab />}
      {tab === "Daten" && <DataTab />}
    </div>
  );
}
