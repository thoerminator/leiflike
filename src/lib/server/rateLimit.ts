import "server-only";

/**
 * Schlichte Bremse gegen Passwort-Durchprobieren.
 * Reicht für einen Ein-Prozess-Server: Fehlversuche werden pro IP gezählt,
 * nach zu vielen ist für eine Weile Schluss. Ein erfolgreicher Login räumt auf.
 */
type Entry = { fails: number; blockedUntil: number; first: number };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;
const BLOCK_MS = 15 * 60 * 1000;

const attempts = new Map<string, Entry>();

/** Gelegentlich alte Einträge wegräumen, damit die Map nicht wächst. */
function sweep(now: number) {
  if (attempts.size < 500) return;
  for (const [k, v] of attempts) {
    if (v.blockedUntil < now && now - v.first > WINDOW_MS) attempts.delete(k);
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unbekannt";
}

export function checkRate(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  sweep(now);
  const e = attempts.get(ip);
  if (e && e.blockedUntil > now) {
    return { ok: false, retryAfter: Math.ceil((e.blockedUntil - now) / 1000) };
  }
  return { ok: true };
}

export function noteFailure(ip: string): void {
  const now = Date.now();
  const e = attempts.get(ip);
  if (!e || now - e.first > WINDOW_MS) {
    attempts.set(ip, { fails: 1, blockedUntil: 0, first: now });
    return;
  }
  e.fails += 1;
  if (e.fails >= MAX_FAILS) {
    e.blockedUntil = now + BLOCK_MS;
    e.fails = 0;
    e.first = now;
  }
}

export function noteSuccess(ip: string): void {
  attempts.delete(ip);
}
