import { NextResponse } from "next/server";
import { checkPassword, createToken, isAuthed, SESSION_COOKIE, cookieOptions } from "@/lib/server/auth";
import { checkRate, noteFailure, noteSuccess, clientIp } from "@/lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bin ich angemeldet? */
export async function GET() {
  return NextResponse.json({ authed: await isAuthed() });
}

/** Anmelden */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const rate = checkRate(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: `Zu viele Versuche. Bitte in ${Math.ceil(rate.retryAfter / 60)} Minuten erneut versuchen.` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const pw = (body as { password?: unknown })?.password;
  if (!checkPassword(pw)) {
    noteFailure(ip);
    await new Promise((r) => setTimeout(r, 600)); // Bremse gegen Durchprobieren
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
  }

  noteSuccess(ip);
  const res = NextResponse.json({ authed: true });
  res.cookies.set(SESSION_COOKIE, createToken(), cookieOptions);
  return res;
}

/** Abmelden */
export async function DELETE() {
  const res = NextResponse.json({ authed: false });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
