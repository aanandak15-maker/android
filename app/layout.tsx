import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agri Smart Platform",
  description: "Comprehensive farm management with AI-powered insights",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriSmart",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} pb-16 bg-gray-50`}>
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
