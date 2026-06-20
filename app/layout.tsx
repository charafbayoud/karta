import type { Metadata } from "next";
import { Playfair_Display, Courier_Prime } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KARTA — Indoor & Outdoor Cycling Platform",
  description:
    "KARTA helps cyclists ride smarter — Zwift route recommendations, GPS Art, and outdoor route generation at karta.club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${courier.variable}`} style={{ ["--font-helvetica" as string]: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <body>{children}</body>
    </html>
  );
}
