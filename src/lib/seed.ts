import images from "./images.json";
import type { Project, CVEntry, ProjectImage, DeskNote } from "./types";

const img = images as Record<string, ProjectImage[]>;

/**
 * Der Lichttisch — Weltkoordinaten.
 * Die Welt ist ~4600 x 3400 groß, der Viewport zeigt je nach Zoom
 * nur einen Ausschnitt. Reihenfolge = Haupt-Pfad.
 * Positionen sind im Admin später frei verschiebbar.
 */
export const WORLD = { w: 4600, h: 3400 };

export const projects: Project[] = [
  {
    slug: "leiflike",
    title: { de: "LeifLike", en: "LeifLike" },
    scope: { de: "Logo, Designsprache und Website", en: "Logo, design language and website" },
    year: "2024",
    note: { de: "Die eigene Marke — vom Zeichenstift bis zum Jutebeutel.", en: "My own brand — from pen stroke to tote bag." },
    category: "design",
    images: img.leiflike,
    x: 1150, y: 780, rot: -3,
  },
  {
    slug: "abizeitung",
    title: { de: "Abizeitung", en: "Grad yearbook" },
    scope: {
      de: "Logo, Look & Feel, Zeitungslayout, Einladung, Ablauf, Präsentation",
      en: "Logo, look & feel, yearbook layout, invitation, programme, presentation",
    },
    year: "2023",
    note: { de: "Fast ein Jahr Umsetzung — ein komplettes Erscheinungsbild für einen Jahrgang.", en: "Nearly a year in the making — a complete identity for a graduating class." },
    category: "design",
    images: img.abizeitung,
    x: 2080, y: 560, rot: 4,
  },
  {
    slug: "anzeigen",
    title: { de: "Anzeigen — Hörforum Murgtal", en: "Ads — Hörforum Murgtal" },
    scope: { de: "Testanzeigen Gemeindeblatt", en: "Trial ads for the parish gazette" },
    note: { de: "Holzheizung, Markisen, Massage — Anzeigen mit Charakter fürs Gemeindeblatt.", en: "Wood heating, awnings, massage — small-town ads with character." },
    category: "design",
    images: img.anzeigen,
    x: 3050, y: 820, rot: -5,
  },
  {
    slug: "neffke",
    title: { de: "Roland Neffke Customs", en: "Roland Neffke Customs" },
    scope: { de: "Plakat DIN A3, ZickZack-Flyer, Banner 3×1 m", en: "A3 poster, zigzag flyer, 3×1 m banner" },
    year: "2024",
    note: { de: "Werbe- und Infomaterial für neue Dienstleistungen.", en: "Promotional material for new services." },
    category: "design",
    images: img.neffke,
    x: 3780, y: 1350, rot: 3,
  },
  {
    slug: "orgelkonzert",
    title: { de: "Orgelkonzert der Filmmusik", en: "Film music organ concert" },
    scope: { de: "Illustration für Werbeposter", en: "Illustration for the concert poster" },
    note: { de: "Totale kreative Freiheit — eine Orgel wird zum Kino.", en: "Total creative freedom — an organ becomes a cinema." },
    category: "illustration",
    images: img.orgelkonzert,
    x: 3350, y: 2150, rot: -4,
  },
  {
    slug: "weihnachtskarten",
    title: { de: "Weihnachtskarten", en: "Christmas cards" },
    client: { de: "Räuberdeern Design", en: "Räuberdeern Design" },
    scope: { de: "Weihnachtskarten für Kund:innen in Firmenfarben", en: "Client Christmas cards in brand colours" },
    year: "2020–2022",
    category: "illustration",
    images: img.weihnachtskarten,
    x: 2450, y: 1650, rot: 5,
  },
  {
    slug: "postkarten",
    title: { de: "Postkarten", en: "Postcards" },
    scope: { de: "Reihe an Postkarten mit Räumen als Motiv", en: "A series of postcards, each one a room" },
    note: { de: "Totale kreative Freiheit — nur für Freund:innen.", en: "Total creative freedom — made for friends only." },
    category: "illustration",
    images: img.postkarten,
    x: 1550, y: 1950, rot: -6,
  },
  {
    slug: "buko",
    title: { de: "BWK Bundeskonferenz", en: "BWK federal conference" },
    scope: {
      de: "Fotografische Begleitung der BuKo — mit Ministerin Thekla Walker und OB Frank Mentrup",
      en: "Conference photography — incl. minister Thekla Walker and mayor Frank Mentrup",
    },
    category: "fotografie",
    images: img.buko,
    x: 680, y: 1500, rot: 2,
  },
  {
    slug: "wintershooting",
    title: { de: "Wintershooting", en: "Winter shoot" },
    scope: { de: "Portraits im Schnee — Model @johannaa.andreaa", en: "Portraits in the snow — model @johannaa.andreaa" },
    year: "2022",
    note: { de: "Münchener Vorort, April, später Schnee.", en: "Munich suburb, April, late snow." },
    category: "fotografie",
    images: img.wintershooting,
    x: 850, y: 2450, rot: -3,
  },
  {
    slug: "theater",
    title: { de: "Theater Freiburg", en: "Theatre Freiburg" },
    scope: {
      de: "Auftritt der School of Life and Dance Freiburg (Generalprobe)",
      en: "School of Life and Dance Freiburg on stage (dress rehearsal)",
    },
    year: "2023",
    category: "fotografie",
    images: img.theater,
    x: 1750, y: 2800, rot: 4,
  },
  {
    slug: "abifeier",
    title: { de: "Abifeier", en: "Graduation night" },
    scope: { de: "Abifeier der Alemannenschule Wutöschingen", en: "Graduation party of Alemannenschule Wutöschingen" },
    year: "2022",
    category: "fotografie",
    images: img.abifeier,
    x: 2700, y: 2750, rot: -2,
  },
  {
    slug: "cosplay",
    title: { de: "Cosplay", en: "Cosplay" },
    scope: { de: "Dainsleif — Genshin Impact, dargestellt von nobiscum.deus.cos", en: "Dainsleif — Genshin Impact, portrayed by nobiscum.deus.cos" },
    category: "fotografie",
    images: img.cosplay,
    x: 3650, y: 2900, rot: 3,
  },
  {
    slug: "mutterkind",
    title: { de: "Mutter-Kind-Shooting", en: "Mother & child shoot" },
    scope: { de: "Ronja Reichert mit Tochter", en: "Ronja Reichert with her daughter" },
    year: "2021",
    category: "fotografie",
    images: img.mutterkind,
    x: 4150, y: 2200, rot: -4,
  },
];

export const aboutPortrait: ProjectImage = (img.about ?? [])[0];

export const cvEntries: CVEntry[] = [
  {
    year: "seit Feb. 2024",
    kind: "taetigkeit",
    title: { de: "Selbstständiger Mediengestalter", en: "Independent media designer" },
    detail: {
      de: "LeifLike Design — Mediengestalter, Illustrator, Fotograf.",
      en: "LeifLike Design — media designer, illustrator, photographer.",
    },
  },
  {
    year: "Sep.–Dez. 2023",
    kind: "taetigkeit",
    title: { de: "Aupair in Kapstadt", en: "Au pair in Cape Town" },
    detail: {
      de: "Betreuung von zwei Kindern (2 und 3 Jahre alt).",
      en: "Caring for two children (aged 2 and 3).",
    },
  },
  {
    year: "2020–2023",
    kind: "bildung",
    title: { de: "Abitur (1,8)", en: "Abitur — final grade 1.8" },
    detail: {
      de: "Alemannenschule Wutöschingen, Gemeinschaftsschuloberstufe.",
      en: "Alemannenschule Wutöschingen, comprehensive upper school.",
    },
  },
  {
    year: "2022–2023",
    kind: "engagement",
    title: { de: "„Lernprofi“", en: "“Learning pro”" },
    detail: {
      de: "Höchste Position des Graduierungssystems — verbunden mit Freiheitsgraden fürs Lernen. Dazu freiwillige Nachhilfe (2018/19 und 2021–2023).",
      en: "Highest rank of the school's graduation system, earning extra learning freedoms. Plus voluntary tutoring (2018/19 and 2021–2023).",
    },
  },
  {
    year: "2013–2021",
    kind: "engagement",
    title: { de: "Alt-katholische Gemeinde", en: "Old Catholic parish" },
    detail: {
      de: "Messdiener; im Lockdown 2020 Gottesdienst-Aufzeichnungen und Livestreaming.",
      en: "Altar server; recorded and live-streamed services during the 2020 lockdown.",
    },
  },
  {
    year: "2017–2019",
    kind: "engagement",
    title: { de: "Referent auf Barcamps", en: "Speaker at barcamps" },
    detail: {
      de: "U. a. zu Fotografie — Hardtcamp 2017, Wildcampen 2019.",
      en: "Talks incl. photography — Hardtcamp 2017, Wildcampen 2019.",
    },
  },
  {
    year: "2016–2018",
    kind: "engagement",
    title: { de: "Schülerzeitung, Wettbewerbe & Compassion", en: "School paper, contests & compassion" },
    detail: {
      de: "Autor der Hardttimes (2016/17); mehrfacher Gewinner des Edeka-Schülerwettbewerbs mit Videoblog („Kreativ. Zukunft. Gestalten.“, „Nachhaltigkeit“); Compassionprojekt im Kindergarten St. Lioba, Durmersheim (2017/18).",
      en: "Author at the Hardttimes school paper (2016/17); repeat winner of the Edeka student contest with a video blog; compassion project at St. Lioba kindergarten, Durmersheim (2017/18).",
    },
  },
  {
    year: "2014–2020",
    kind: "bildung",
    title: { de: "Realschulabschluss", en: "Secondary school certificate" },
    detail: {
      de: "Hardtschule Durmersheim, Gemeinschaftsschule. Träger des „Fitbutton“ für vorbildliches Lern- und Arbeitsverhalten.",
      en: "Hardtschule Durmersheim, comprehensive school. Awarded the “Fitbutton” for exemplary learning and work habits.",
    },
  },
  {
    year: "2010–2014",
    kind: "bildung",
    title: { de: "Karl-Schurz Grundschule, Rastatt", en: "Karl Schurz primary school, Rastatt" },
    detail: { de: "Montessorischule.", en: "Montessori school." },
  },
];

/** Liebe Notizen auf dem Tisch — im Admin verschieb- und editierbar */
export const deskNotes: DeskNote[] = [
  {
    id: "note-tagline",
    x: 1560,
    y: 380,
    rot: -5,
    text: "Deine Vorstellung,\nmeine Kreativität,\nunser Projekt.",
    color: "sun",
    font: "hand",
  },
  {
    id: "note-hallo",
    x: 3420,
    y: 1620,
    rot: 3.5,
    text: "Schön, dass du\nvorbeischaust.",
    color: "rose",
    font: "serif",
  },
  {
    id: "note-kaffee",
    x: 640,
    y: 2050,
    rot: -3,
    text: "Erst Kaffee,\ndann Kreativität.\n— Leif",
    color: "sky",
    font: "sans",
  },
  {
    id: "note-magie",
    x: 2350,
    y: 2380,
    rot: 4,
    text: "Psst:\nDoppelklick\nzaubert.",
    color: "lavender",
    font: "hand",
  },
];

export const contact = {
  email: "info@leiflike.de",
  city: { de: "Leipzig", en: "Leipzig, Germany" },
  instagram: "https://www.instagram.com/leiflike.de/",
};

export const tools = ["Illustrator", "Photoshop", "InDesign", "Lightroom", "ProCreate", "Canva"];
