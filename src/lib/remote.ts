/**
 * Supabase-Adapter (vorbereitet, per ENV aktiviert — noch nicht verdrahtet).
 *
 * Aktivierung später:
 * 1. `npm i @supabase/supabase-js`
 * 2. `.env.local`:
 *      NEXT_PUBLIC_SUPABASE_URL=...
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 * 3. Tabellen (SQL siehe unten), Storage-Bucket `images` (public read),
 *    Auth: E-Mail-Login, Rollen über `profiles.role` (admin | editor).
 * 4. In lib/store.ts den Local-Layer gegen diese Funktionen tauschen —
 *    die App-Oberfläche (Lichttisch, About, Admin) bleibt unverändert,
 *    weil alle Komponenten nur über useAppData()/setData() sprechen.
 *
 * Später Cloudflare R2: nur `uploadImage` austauschen (S3-kompatibles PUT),
 * die `src`-Strings bleiben URLs — kein Umbau der App-Logik.
 *
 * -- SQL-Skizze -------------------------------------------------
 * create table content (
 *   id int primary key default 1 check (id = 1),
 *   data jsonb not null,          -- kompletter AppData-Stand
 *   updated_at timestamptz default now()
 * );
 * -- RLS: select für alle, update nur authenticated mit role admin/editor
 * ---------------------------------------------------------------
 */

export const remoteEnabled =
  typeof process !== "undefined" &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function fetchRemoteData(): Promise<unknown | null> {
  if (!remoteEnabled) return null;
  // TODO(supabase): supabase.from("content").select("data").single()
  return null;
}

export async function pushRemoteData(_data: unknown): Promise<void> {
  if (!remoteEnabled) return;
  // TODO(supabase): supabase.from("content").upsert({ id: 1, data: _data })
}

export async function uploadImage(_id: string, _blob: Blob): Promise<string> {
  // TODO(supabase): storage.from("images").upload(...) → public URL zurückgeben
  throw new Error("Remote-Storage noch nicht aktiviert");
}
