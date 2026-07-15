import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/server/content";
import { isAuthed } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // der Client komprimiert vorher zu WebP

/** Geschützt: ein bereits komprimiertes WebP entgegennehmen. */
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Keine Datei" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Datei zu groß" }, { status: 413 });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  // WebP-Signatur prüfen: RIFF....WEBP
  const isWebp =
    bytes.length > 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!isWebp) {
    return NextResponse.json({ error: "Nur WebP erlaubt" }, { status: 415 });
  }
  const name = await saveUpload(bytes);
  return NextResponse.json({ src: `/api/uploads/${name}` });
}
