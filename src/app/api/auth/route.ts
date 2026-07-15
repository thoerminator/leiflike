import { NextResponse } from "next/server";
import { checkPassword, createToken, isAuthed, SESSION_COOKIE, cookieOptions } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bin ich angemeldet? */
export async function GET() {
  return NextResponse.json({ authed: await isAuthed() });
}

/** Anmelden */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  const pw = (body as { password?: unknown })?.password;
  if (!checkPassword(pw)) {
    // Kleine Bremse gegen Durchprobieren
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
  }
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
