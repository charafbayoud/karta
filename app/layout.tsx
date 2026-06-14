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
  title: "KARTA — Zwift Route Recommendations",
  description:
    "KARTA finds the perfect Zwift route for your next ride based on your available time, experience level and training goal.",
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
