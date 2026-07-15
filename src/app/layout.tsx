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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
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
