import type { Metadata } from "next";
import { Courier_Prime, Inter, Playfair_Display } from "next/font/google";
import { GlobalClientShell } from "@/components/shared/GlobalClientShell";
import { rootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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

export const metadata: Metadata = rootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${courier.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {children}
        <GlobalClientShell />
      </body>
    </html>
  );
}
