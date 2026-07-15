"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Locale, L10n } from "./types";

const dict = {
  de: {
    portfolio: "Portfolio",
    about: "Über mich",
    menu: "Menü",
    close: "Schließen",
    project: "Projekt",
    client: "Kundin",
    scope: "Umfang",
    year: "Jahr",
    design: "Design",
    illustration: "Illustration",
    fotografie: "Fotografie",
    dragHint: "Ziehen zum Erkunden · Scrollen für die Führung",
    weiter: "weiter",
    tagline: "Deine Vorstellung, meine Kreativität, unser Projekt.",
    role: "Grafikdesigner und Fotograf aus Leidenschaft",
    toolbox: "Mein Werkzeugkasten",
    journey: "Der Weg bis hierher",
    getInTouch: "Erzähl von deinem Projekt",
    backToTable: "Zurück zum Tisch",
    aboutIntro:
      "Ich bin Leif Thörmer — Grafikdesigner und Fotograf. Ich gestalte Marken, Drucksachen und Illustrationen und begleite Momente mit der Kamera. Am liebsten dort, wo beides zusammenkommt: durchdachtes Design mit Herz und Handschrift.",
    imprint: "Kontakt",
    bildung: "Bildung",
    taetigkeit: "Tätigkeit",
    engagement: "Engagement",
    adminLogin: "Admin",
    password: "Passwort",
    wrongPassword: "Falsches Passwort — Tipp: die Tagline endet damit.",
    carouselHint: "Scrollen oder Pfeiltasten zum Blättern · Esc schließt",
  },
  en: {
    portfolio: "Portfolio",
    about: "About",
    menu: "Menu",
    close: "Close",
    project: "Project",
    client: "Client",
    scope: "Scope",
    year: "Year",
    design: "Design",
    illustration: "Illustration",
    fotografie: "Photography",
    dragHint: "Drag to explore · scroll for the guided tour",
    weiter: "continue",
    tagline: "Your vision, my creativity, our project.",
    role: "Graphic designer and photographer by heart",
    toolbox: "My toolbox",
    journey: "The road so far",
    getInTouch: "Tell me about your project",
    backToTable: "Back to the table",
    aboutIntro:
      "I'm Leif Thörmer — graphic designer and photographer. I craft brands, print and illustration, and follow moments with my camera. Happiest where both meet: thoughtful design with heart and handwriting.",
    imprint: "Contact",
    bildung: "Education",
    taetigkeit: "Work",
    engagement: "Engagement",
    adminLogin: "Admin",
    password: "Password",
    wrongPassword: "Wrong password — hint: the tagline ends with it.",
    carouselHint: "Scroll or arrow keys to browse · Esc closes",
  },
} as const;

type DictKey = keyof (typeof dict)["de"];

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: DictKey) => string;
  l: (v: L10n | undefined) => string;
}

const Ctx = createContext<I18nCtx>({
  locale: "de",
  setLocale: () => {},
  t: (k) => dict.de[k],
  l: (v) => v?.de ?? "",
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("de");
  const t = (k: DictKey) => dict[locale][k];
  const l = (v: L10n | undefined) => (v ? v[locale] : "");
  return <Ctx.Provider value={{ locale, setLocale, t, l }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
