import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Poppins,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Tallownara — Natural Skin Rituals",
  description:
    "Tallownara adalah perawatan kulit alami dari Bogor yang terinspirasi dari cinta seorang ibu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
