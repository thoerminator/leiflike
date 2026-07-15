import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/server/content";
import { isAuthed } from "@/lib/server/auth";
import { DATA_VERSION } from "@/lib/defaults";
import type { AppData } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Öffentlich: die Inhalte, die jeder Besucher sieht. */
export async function GET() {
  const data = await readContent();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

/** Geschützt: Inhalte speichern. */
export async function PUT(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültiges JSON" }, { status: 400 });
  }
  const d = body as Partial<AppData>;
  if (
    !d ||
    d.version !== DATA_VERSION ||
    !Array.isArray(d.projects) ||
    !Array.isArray(d.cv) ||
    !Array.isArray(d.notes) ||
    typeof d.profile !== "object" ||
    typeof d.settings !== "object"
  ) {
    return NextResponse.json({ error: "Unerwartete Datenstruktur" }, { status: 422 });
  }
  await writeContent(d as AppData);
  return NextResponse.json({ ok: true });
}
