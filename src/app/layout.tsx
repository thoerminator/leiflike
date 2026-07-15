import type { Metadata, Viewport } from "next";
import { I18nProvider } from "@/lib/i18n";
import { HandCursor } from "@/components/experience/HandCursor";
import { themeInitScript } from "@/lib/theme";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const description =
  "Deine Vorstellung, meine Kreativität, unser Projekt. Design, Illustration und Fotografie von Leif Thörmer aus Leipzig.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LeifLike Design — Leif Thörmer",
    template: "%s · LeifLike Design",
  },
  description,
  applicationName: "LeifLike Design",
  authors: [{ name: "Leif Thörmer", url: siteUrl }],
  creator: "Leif Thörmer",
  keywords: [
    "Grafikdesign",
    "Illustration",
    "Fotografie",
    "Branding",
    "Leipzig",
    "Leif Thörmer",
    "LeifLike Design",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "LeifLike Design",
    title: "LeifLike Design — Leif Thörmer",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "LeifLike Design — Leif Thörmer",
    description,
  },
  robots: { index: true, follow: true },
  // /admin gehört nicht in Suchmaschinen
  other: { "format-detection": "telephone=no" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Schriften liegen selbst gehostet in /public/brand/fonts — keine
            Verbindung zu Google, also kein Abfluss von Besucher-IPs. */}
        <link
          rel="preload"
          href="/brand/fonts/hanken-400-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <I18nProvider>
          {children}
          <HandCursor />
          <div className="ll-grain" aria-hidden />
        </I18nProvider>
      </body>
    </html>
  );
}
