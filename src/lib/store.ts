"use client";

/**
 * Datenschicht — der Server ist die einzige Wahrheit.
 * - Lesen:  GET /api/content  (jeder Besucher sieht denselben Stand)
 * - Speichern: PUT /api/content (nur angemeldet, gebündelt/entprellt)
 * - Bilder: POST /api/upload → liegen als WebP im Volume, Pfad /api/uploads/<id>.webp
 *
 * Bis die Antwort da ist, rendert der Seed — es blitzt also nie eine leere Seite.
 */

import { useEffect, useSyncExternalStore } from "react";
import { defaultData } from "./defaults";
import type { AppData } from "./types";

let state: AppData = defaultData();
let hydrating: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

/** Einmalig vom Server laden. */
export function ensureHydrated(): Promise<void> {
  if (hydrating) return hydrating;
  hydrating = (async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as AppData;
      if (data?.version === state.version) {
        state = data;
        emit();
      }
    } catch {
      /* offline: der Seed bleibt stehen */
    }
  })();
  return hydrating;
}

export function getData(): AppData {
  return state;
}

/* ---- Speichern: entprellt, damit Tippen nicht jede Taste hochlädt ---- */

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pushing = false;
let pendingAgain = false;

export type SaveState = "idle" | "saving" | "saved" | "error" | "unauthorized";
let saveState: SaveState = "idle";
const saveListeners = new Set<() => void>();

function setSaveState(s: SaveState) {
  saveState = s;
  saveListeners.forEach((fn) => fn());
}

async function push() {
  if (pushing) {
    pendingAgain = true;
    return;
  }
  pushing = true;
  setSaveState("saving");
  try {
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (res.status === 401) setSaveState("unauthorized");
    else if (!res.ok) setSaveState("error");
    else setSaveState("saved");
  } catch {
    setSaveState("error");
  } finally {
    pushing = false;
    if (pendingAgain) {
      pendingAgain = false;
      void push();
    }
  }
}

export function setData(next: AppData) {
  state = next;
  emit();
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(push, 700);
}

export function resetData() {
  setData(defaultData());
}

export function useAppData(): AppData {
  const data = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state
  );
  useEffect(() => {
    void ensureHydrated();
  }, []);
  return data;
}

export function useSaveState(): SaveState {
  return useSyncExternalStore(
    (cb) => {
      saveListeners.add(cb);
      return () => saveListeners.delete(cb);
    },
    () => saveState,
    () => "idle" as SaveState
  );
}

/* ---------------- Bilder ---------------- */

/** Serverpfade brauchen keine Auflösung mehr — bleibt als schmale Naht. */
export function resolveSrc(src: string): string {
  return src ?? "";
}

/** Client-seitige Kompression: max 1600px, WebP q0.82 */
export async function compressImage(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  const blob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode"))), "image/webp", 0.82)
  );
  return { blob, w, h };
}

/** Komprimieren + hochladen. Liefert den öffentlichen Pfad. */
export async function uploadImage(file: File): Promise<{ src: string; w: number; h: number }> {
  const { blob, w, h } = await compressImage(file);
  const fd = new FormData();
  fd.append("file", blob, "upload.webp");
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Upload fehlgeschlagen" }));
    throw new Error(error ?? "Upload fehlgeschlagen");
  }
  const { src } = (await res.json()) as { src: string };
  return { src, w, h };
}

/* ---------------- Anmeldung ---------------- */

export async function login(password: string): Promise<boolean> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth", { method: "DELETE" });
}

export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth", { cache: "no-store" });
    const { authed } = (await res.json()) as { authed: boolean };
    return authed;
  } catch {
    return false;
  }
}
