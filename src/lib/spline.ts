/**
 * Pfad-Mathematik für den Lichttisch.
 * Catmull-Rom-Spline durch die Projektpositionen (Haupt-Pfad),
 * arc-length-parametrisiert, plus dynamisch generierte Zubringer
 * von beliebigen Punkten auf den Pfad.
 */

export interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom zwischen p1 und p2 (centripetal-nah, tension 0.5) */
function catmullRom(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

/** Spline durch Punkte sampeln (offene Kurve, Endpunkte gespiegelt) */
export function sampleSpline(points: Pt[], perSegment = 24): Pt[] {
  if (points.length < 2) return [...points];
  const ext = [points[0], ...points, points[points.length - 1]];
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [ext[i], ext[i + 1], ext[i + 2], ext[i + 3]];
    for (let j = 0; j < perSegment; j++) {
      out.push(catmullRom(p0, p1, p2, p3, j / perSegment));
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/** Quadratische Bezier für Zubringer-Kurven */
export function sampleQuad(a: Pt, c: Pt, b: Pt, n = 32): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    });
  }
  return out;
}

export class Route {
  pts: Pt[];
  /** kumulierte Bogenlänge pro Punkt */
  cum: number[];
  total: number;
  /** Bogenlängen-Anker: Position jedes Knotens (Projekts) auf der Route */
  anchors: number[];

  constructor(pts: Pt[], anchorPts: Pt[] = []) {
    this.pts = pts;
    this.cum = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      this.cum.push(this.cum[i - 1] + Math.hypot(dx, dy));
    }
    this.total = this.cum[this.cum.length - 1] || 1;
    this.anchors = anchorPts.map((a) => {
      let best = 0;
      let bd = Infinity;
      for (let i = 0; i < pts.length; i++) {
        const d = Math.hypot(pts[i].x - a.x, pts[i].y - a.y);
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      return this.cum[best];
    });
  }

  /** Punkt bei Bogenlänge s */
  at(s: number): Pt {
    const c = this.cum;
    const n = c.length;
    if (s <= 0) return this.pts[0];
    if (s >= this.total) return this.pts[n - 1];
    let lo = 0;
    let hi = n - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (c[mid] <= s) lo = mid;
      else hi = mid;
    }
    const seg = c[hi] - c[lo] || 1;
    const t = (s - c[lo]) / seg;
    const a = this.pts[lo];
    const b = this.pts[hi];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  /** Distanz (Bogenlänge) zum nächsten Anker von s aus */
  nearestAnchorDist(s: number): number {
    let d = Infinity;
    for (const a of this.anchors) d = Math.min(d, Math.abs(a - s));
    return d;
  }

  /** Nächster Anker-Index in Scrollrichtung */
  nextAnchor(s: number, dir: 1 | -1): number {
    if (dir > 0) {
      for (const a of this.anchors) if (a > s + 40) return a;
      return this.total;
    }
    for (let i = this.anchors.length - 1; i >= 0; i--) {
      if (this.anchors[i] < s - 40) return this.anchors[i];
    }
    return 0;
  }
}

/** Haupt-Route durch alle Projekte */
export function buildMainRoute(nodes: Pt[]): Route {
  return new Route(sampleSpline(nodes, 40), nodes);
}

/**
 * Kombinierte Route: Zubringer von `from` zum nächstgelegenen Knoten,
 * dort in den Haupt-Pfad einfädeln.
 * Rückgabe: Route + Einstiegs-Bogenlänge (= Länge des Zubringers).
 */
export function buildApproachRoute(from: Pt, nodes: Pt[], main: Route): { route: Route; entry: number } {
  let ni = 0;
  let nd = Infinity;
  nodes.forEach((n, i) => {
    const d = Math.hypot(n.x - from.x, n.y - from.y);
    if (d < nd) {
      nd = d;
      ni = i;
    }
  });
  const target = nodes[ni];
  if (nd < 60) {
    // praktisch auf dem Knoten — direkt Haupt-Route benutzen
    return { route: main, entry: main.anchors[ni] };
  }
  // Kontrollpunkt: seitlich versetzt für einen schönen Bogen
  const mx = (from.x + target.x) / 2;
  const my = (from.y + target.y) / 2;
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ctrl = { x: mx - (dy / len) * len * 0.15, y: my + (dx / len) * len * 0.15 };
  const approach = sampleQuad(from, ctrl, target, 48);

  // Haupt-Pfad ab dem Einfädel-Knoten in beide Richtungen anhängen:
  // wir hängen den kompletten Haupt-Pfad an und starten am Anker.
  const entryAnchor = main.anchors[ni];
  const before: Pt[] = [];
  const after: Pt[] = [];
  for (let i = 0; i < main.pts.length; i++) {
    if (main.cum[i] < entryAnchor) before.push(main.pts[i]);
    else after.push(main.pts[i]);
  }
  // Route: [rückwärtiger Hauptpfad ... Knoten] existiert schon im Hauptpfad —
  // der Zubringer ersetzt ihn: unsere Route = approach + after (vorwärts)
  // Rückwärts-Scrollen vom Einstieg aus läuft den Zubringer zurück.
  const pts = [...approach, ...after.slice(1)];
  const anchorPts = [nodes[ni], ...nodes.slice(ni + 1)];
  const route = new Route(pts, anchorPts);
  return { route, entry: route.anchors[0] };
}

/**
 * Hand-Jitter: verschiebt Pfadpunkte minimal orthogonal,
 * deterministisch — wie mit dem Bleistift gezogen.
 */
export function jitter(pts: Pt[], amp = 1.6, freq = 0.3): Pt[] {
  return pts.map((p, i) => {
    const n = Math.sin(i * freq * 1.7 + 1.3) * 0.6 + Math.sin(i * freq * 0.53 + 4.1) * 0.4;
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (-dy / len) * n * amp, y: p.y + (dx / len) * n * amp };
  });
}

export function toPolyline(pts: Pt[]): string {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}
