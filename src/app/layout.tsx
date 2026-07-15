import type { Metadata, Viewport } from "next";
import { I18nProvider } from "@/lib/i18n";
import { HandCursor } from "@/components/experience/HandCursor";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeifLike Design — Leif Thörmer",
  description:
    "Deine Vorstellung, meine Kreativität, unser Projekt. Design, Illustration und Fotografie von Leif Thörmer.",
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
