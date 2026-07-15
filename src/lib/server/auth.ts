import "server-only";

import { createHmac, createHash, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ll_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage

/**
 * Echte Anmeldung: Passwort + Signatur-Geheimnis kommen aus der Umgebung,
 * die Sitzung steckt in einem signierten httpOnly-Cookie. Ohne gültige
 * Signatur schreibt niemand Inhalte — das Cookie lässt sich nicht fälschen.
 */
function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET fehlt (mind. 16 Zeichen) — siehe .env.example");
  }
  return "dev-only-secret-nicht-fuer-produktion";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "unser-projekt";
}

function safeEqual(a: string, b: string): boolean {
  // Über den Hash vergleichen: gleiche Länge, kein Timing-Leak
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(pw: unknown): boolean {
  return typeof pw === "string" && pw.length > 0 && safeEqual(pw, adminPassword());
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createToken(): string {
  const payload = `${Date.now() + MAX_AGE * 1000}.${randomBytes(6).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const exp = Number(payload.split(".")[0]);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
