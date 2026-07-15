import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { defaultData, DATA_VERSION } from "../defaults";
import type { AppData } from "../types";

/**
 * Inhalte + Uploads liegen auf der Platte, nicht im Container:
 * im Docker unter /data (Volume), lokal unter ./.data
 */
const DATA_DIR = process.env.LEIFLIKE_DATA_DIR || path.join(process.cwd(), ".data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export const UPLOAD_NAME_RE = /^[a-f0-9]{24}\.webp$/;

async function ensureDirs() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function readContent(): Promise<AppData> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = JSON.parse(raw) as AppData;
    if (parsed?.version === DATA_VERSION) return parsed;
  } catch {
    /* noch nichts gespeichert — Seed ausliefern */
  }
  return defaultData();
}

/** Atomar schreiben: erst temporär, dann umbenennen — nie eine halbe Datei. */
export async function writeContent(data: AppData): Promise<void> {
  await ensureDirs();
  const tmp = `${CONTENT_FILE}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_FILE);
}

/** Der Dateiname kommt vom Server — damit ist Path-Traversal ausgeschlossen. */
export async function saveUpload(bytes: Buffer): Promise<string> {
  await ensureDirs();
  const name = `${randomBytes(12).toString("hex")}.webp`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  return name;
}

export async function readUpload(name: string): Promise<Buffer | null> {
  if (!UPLOAD_NAME_RE.test(name)) return null;
  try {
    return await fs.readFile(path.join(UPLOAD_DIR, name));
  } catch {
    return null;
  }
}
