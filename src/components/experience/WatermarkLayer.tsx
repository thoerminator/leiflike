"use client";

import { WORLD } from "@/lib/seed";
import type { WatermarkSettings } from "@/lib/types";

const logoMeta: Record<WatermarkSettings["logo"], { file: string; w: number; h: number; base: number }> = {
  wordmark: { file: "wordmark-black.png", w: 1045, h: 281, base: 520 },
  stacked: { file: "wordmark-stacked-tint.png", w: 554, h: 462, base: 340 },
  mono: { file: "mono-L-black.png", w: 547, h: 509, base: 280 },
  badge: { file: "badge-L.png", w: 842, h: 841, base: 300 },
};

/**
 * Logo-Wasserzeichen als echtes Backsteinmuster: jede zweite Reihe ist um
 * eine halbe Kachel versetzt. Liegt in der Welt (wandert mit) und wird in
 * der Admin-Vorschau identisch gerendert — gleiche Komponente, gleiche Optik.
 */
export function WatermarkLayer({ wm }: { wm: WatermarkSettings }) {
  if (!wm?.enabled) return null;
  const meta = logoMeta[wm.logo] ?? logoMeta.mono;
  const imgW = meta.base * (wm.size || 1);
  const imgH = (imgW * meta.h) / meta.w;
  // Dichte: 2 = eng gepackt, 0.5 = sehr locker
  const gap = 2.4 - Math.min(Math.max(wm.density || 1, 0.5), 2);
  const cellW = imgW * (1 + gap);
  const cellH = imgH * (1 + gap);
  const pid = `wm-${wm.logo}`;

  return (
    <div className="ll-watermark" style={{ opacity: wm.opacity }} aria-hidden>
      <svg width="100%" height="100%" viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={pid} width={cellW} height={cellH * 2} patternUnits="userSpaceOnUse" patternTransform="rotate(-9)">
            <image href={`/brand/logo/${meta.file}`} x={(cellW - imgW) / 2} y={(cellH - imgH) / 2} width={imgW} height={imgH} />
            <image
              href={`/brand/logo/${meta.file}`}
              x={(cellW - imgW) / 2 - cellW / 2}
              y={cellH + (cellH - imgH) / 2}
              width={imgW}
              height={imgH}
            />
            <image
              href={`/brand/logo/${meta.file}`}
              x={(cellW - imgW) / 2 + cellW / 2}
              y={cellH + (cellH - imgH) / 2}
              width={imgW}
              height={imgH}
            />
          </pattern>
        </defs>
        <rect x={-WORLD.w * 0.2} y={-WORLD.h * 0.2} width={WORLD.w * 1.4} height={WORLD.h * 1.4} fill={`url(#${pid})`} />
      </svg>
    </div>
  );
}
