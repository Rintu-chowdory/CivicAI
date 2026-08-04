import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },

  title: "CivicAI — Behörden verstehen. Rechte kennen. Sicher handeln.",
  description:
    "KI für faire, verständliche und transparente Behördenkommunikation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body
        className={`${body.variable} ${mono.variable} font-body bg-canvas text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
