/**
 * Die Ausgangsinhalte — von Server und Client gemeinsam genutzt.
 * (Kein "use client": die API-Routen importieren das hier ebenfalls.)
 */

import { projects as seedProjects, cvEntries as seedCV, contact, tools, aboutPortrait, deskNotes } from "./seed";
import type { AppData, Profile, Settings } from "./types";

export const DATA_VERSION = 4;

export const defaultSettings: Settings = {
  texture: "dots",
  watermark: { enabled: false, logo: "mono", opacity: 0.07, size: 1, density: 1 },
};

export const defaultProfile: Profile = {
  name: "Leif Thörmer",
  role: {
    de: "Grafikdesigner und Fotograf aus Leidenschaft",
    en: "Graphic designer and photographer by heart",
  },
  intro: {
    de: "Ich bin Leif Thörmer — Grafikdesigner und Fotograf. Ich gestalte Marken, Drucksachen und Illustrationen und begleite Momente mit der Kamera. Am liebsten dort, wo beides zusammenkommt: durchdachtes Design mit Herz und Handschrift.",
    en: "I'm Leif Thörmer — graphic designer and photographer. I craft brands, print and illustration, and follow moments with my camera. Happiest where both meet: thoughtful design with heart and handwriting.",
  },
  tools,
  email: contact.email,
  instagram: contact.instagram,
  city: contact.city,
  tagline: {
    de: "Deine Vorstellung, meine Kreativität, unser Projekt.",
    en: "Your vision, my creativity, our project.",
  },
  portrait: aboutPortrait ?? null,
  portraitFocus: { x: 60, y: 30 },
};

export function defaultData(): AppData {
  return {
    version: DATA_VERSION,
    projects: structuredClone(seedProjects),
    cv: structuredClone(seedCV),
    profile: structuredClone(defaultProfile),
    settings: structuredClone(defaultSettings),
    notes: structuredClone(deskNotes),
  };
}
