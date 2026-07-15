import { NextResponse } from "next/server";
import { readUpload } from "@/lib/server/content";

export const runtime = "nodejs";

/** Öffentlich: hochgeladene Bilder ausliefern (Dateiname ist servergeneriert). */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const bytes = await readUpload(name);
  if (!bytes) return new NextResponse("Nicht gefunden", { status: 404 });
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "image/webp",
      // Name ist inhaltsbasiert eindeutig → dauerhaft cachebar
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
