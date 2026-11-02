import localFont from "next/font/local";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle || settings.siteName || "Romesh Portfolio",
    description: settings.seoDescription || "Full-stack developer building web applications and business systems.",
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
