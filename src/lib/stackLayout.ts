import type { Project, ProjectImage } from "./types";

/** Deterministischer Pseudo-Zufall aus String + Index (für stabile Layouts) */
export function hashRand(seed: string, i: number, salt = 0): number {
  let h = 2166136261 ^ (i * 16777619) ^ (salt * 374761393);
  for (let c = 0; c < seed.length; c++) {
    h ^= seed.charCodeAt(c);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

export interface PlacedImage {
  x: number;
  y: number;
  rot: number;
  w: number;
  h: number;
  z: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function fitSize(img: ProjectImage, maxDim: number): { w: number; h: number } {
  const s = maxDim / Math.max(img.w, img.h);
  return { w: r2(img.w * s), h: r2(img.h * s) };
}

export const STACK_MAX = 260;

/**
 * Zusammengelegter Stapel: oberstes Bild zentriert, jedes darunterliegende
 * in eine eigene Richtung geschoben, so dass 20–50 % von ihm sichtbar bleiben.
 */
export function collapsedLayout(p: Project): PlacedImage[] {
  const n = p.images.length;
  const baseAngle = hashRand(p.slug, 99) * Math.PI * 2;
  return p.images.map((im, i) => {
    const { w, h } = fitSize(im, STACK_MAX - i * 10);
    if (i === 0) {
      return { x: 0, y: 0, rot: hashRand(p.slug, 0) * 6 - 3, w, h, z: n };
    }
    // Richtung: um den Stapel herum verteilt, deterministisch
    const a = baseAngle + (i / n) * Math.PI * 2 + (hashRand(p.slug, i) - 0.5) * 0.9;
    // Sichtbarkeit 20–50%: Versatz zwischen 0.30 und 0.48 der Kantenlänge
    const f = 0.3 + hashRand(p.slug, i, 7) * 0.18;
    const dx = Math.cos(a) * w * f;
    const dy = Math.sin(a) * h * f * 0.75;
    const rot = (hashRand(p.slug, i, 3) - 0.5) * 16;
    return { x: dx, y: dy, rot, w, h, z: n - i };
  });
}

/**
 * Ausgebreitet: „justified gallery" — Reihen füllen die verfügbare Breite,
 * respektieren die Seitenverhältnisse und brechen um, statt zu schrumpfen.
 * Wird das Board höher als der Ausschnitt, pannt die Kamera (Scroll).
 */
export function expandedLayout(
  p: Project,
  maxRowWidth = 1240
): { items: PlacedImage[]; width: number; height: number } {
  const gap = 36;
  const targetH = 300;

  // Reihen greedy füllen (auf Basis der Zielhöhe)
  const rows: { imgs: { w: number; h: number }[]; scale: number }[] = [];
  let cur: { w: number; h: number }[] = [];
  let curW = 0;
  for (const im of p.images) {
    const w = (im.w / im.h) * targetH;
    if (cur.length > 0 && curW + gap + w > maxRowWidth) {
      rows.push({ imgs: cur, scale: 1 });
      cur = [];
      curW = 0;
    }
    cur.push({ w, h: targetH });
    curW += (cur.length > 1 ? gap : 0) + w;
  }
  if (cur.length) rows.push({ imgs: cur, scale: 1 });

  // Volle Reihen exakt auf maxRowWidth bringen (justified);
  // die letzte Reihe bleibt natürlich und wird zentriert.
  rows.forEach((row, ri) => {
    const raw = row.imgs.reduce((a, b) => a + b.w, 0) + gap * (row.imgs.length - 1);
    if (ri < rows.length - 1 || raw > maxRowWidth) {
      row.scale = (maxRowWidth - gap * (row.imgs.length - 1)) / (raw - gap * (row.imgs.length - 1));
    }
  });

  const rowHeights = rows.map((r) => targetH * r.scale);
  const rowGap = 44;
  const height = rowHeights.reduce((a, b) => a + b, 0) + rowGap * (rows.length - 1);
  const width = rows.length > 1 ? maxRowWidth : Math.min(maxRowWidth, rows[0].imgs.reduce((a, b) => a + b.w, 0) + gap * (rows[0].imgs.length - 1));

  const items: PlacedImage[] = [];
  let idx = 0;
  let cy = -height / 2;
  rows.forEach((row) => {
    const h = targetH * row.scale;
    const rowW = row.imgs.reduce((a, b) => a + b.w * row.scale, 0) + gap * (row.imgs.length - 1);
    let cx = -rowW / 2;
    for (const im of row.imgs) {
      const w = im.w * row.scale;
      const wave = Math.sin(idx * 1.7 + hashRand(p.slug, idx, 11) * 2) * 10;
      const rot = (hashRand(p.slug, idx, 5) - 0.5) * 3.6;
      items.push({ x: r2(cx + w / 2), y: r2(cy + h / 2 + wave), rot: r2(rot), w: r2(w), h: r2(h), z: idx + 1 });
      cx += w + gap;
      idx++;
    }
    cy += h + rowGap;
  });
  return { items, width: r2(width), height: r2(height) };
}

/** Kategorie-Farben — Washi-Tape auf den Stapeln, Dots in der Timeline */
export const categoryColor: Record<string, { tape: string; strong: string }> = {
  design: { tape: "rgba(201, 80, 255, 0.55)", strong: "#c950ff" },
  illustration: { tape: "rgba(255, 149, 249, 0.6)", strong: "#ff95f9" },
  fotografie: { tape: "rgba(160, 147, 255, 0.6)", strong: "#a093ff" },
};
