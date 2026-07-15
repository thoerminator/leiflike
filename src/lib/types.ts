export type Locale = "de" | "en";

export interface L10n {
  de: string;
  en: string;
}

export interface ProjectImage {
  src: string;
  w: number;
  h: number;
}

export type Category = "design" | "illustration" | "fotografie";

export interface Project {
  slug: string;
  title: L10n;
  client?: L10n;
  scope?: L10n;
  year?: string;
  note?: L10n;
  category: Category;
  images: ProjectImage[];
  /** Position auf dem Lichttisch (Weltkoordinaten) + Grundrotation */
  x: number;
  y: number;
  rot: number;
}

export type CVKind = "bildung" | "taetigkeit" | "engagement";

export interface CVEntry {
  year: string;
  title: L10n;
  detail: L10n;
  kind: CVKind;
}

export type TextureId = "paper" | "dots" | "grid" | "linen" | "plain";

export type WatermarkLogo = "wordmark" | "stacked" | "mono" | "badge";

export interface WatermarkSettings {
  enabled: boolean;
  logo: WatermarkLogo;
  /** 0–0.3 */
  opacity: number;
  /** 0.5–2 — Logo-Größe */
  size: number;
  /** 0.5–2 — wie dicht die Logos liegen (Abstand) */
  density: number;
}

export interface Settings {
  texture: TextureId;
  watermark: WatermarkSettings;
}

export type NoteColor = "sun" | "rose" | "sky" | "lavender";
export type NoteFont = "hand" | "serif" | "sans";

export interface DeskNote {
  id: string;
  x: number;
  y: number;
  rot: number;
  text: string;
  color: NoteColor;
  font: NoteFont;
}

export interface Profile {
  name: string;
  role: L10n;
  intro: L10n;
  tools: string[];
  email: string;
  instagram: string;
  city: L10n;
  tagline: L10n;
  portrait: ProjectImage | null;
  /** Bildausschnitt (object-position) für den Hochkant-Zuschnitt, in % */
  portraitFocus: { x: number; y: number };
}

export interface AppData {
  version: number;
  projects: Project[];
  cv: CVEntry[];
  profile: Profile;
  settings: Settings;
  notes: DeskNote[];
}
