import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4338ca",
};

export const metadata: Metadata = {
  title: {
    default: "anviable.id: Direktori Kompetisi Siswa SMA, SMK, dan MA Indonesia",
    template: "%s | anviable.id",
  },
  description:
    "Direktori dan kurasi kompetisi pelajar SMA, SMK, dan MA terlengkap di Indonesia. Temukan lomba teknologi, sains, desain, bisnis, seni, dan karya ilmiah terverifikasi.",
  keywords: [
    "anviable",
    "anviable.id",
    "lomba SMA",
    "lomba SMK",
    "kompetisi pelajar",
    "hackathon pelajar",
    "olimpiade sains",
    "LKS SMK",
    "prestasi SNBP",
    "Indonesia",
  ],
  openGraph: {
    title: "anviable.id: Direktori Kompetisi Siswa SMA, SMK, dan MA",
    description:
      "Direktori kompetisi pelajar SMA, SMK, dan MA terlengkap di Indonesia.",
    type: "website",
    locale: "id_ID",
  },
};

import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased text-slate-900 bg-[#f8fafc] selection:bg-indigo-500/20 selection:text-indigo-900">
        <Navbar />

        <main className="mx-auto min-h-[calc(100vh-4rem-4.5rem)] max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:pb-6">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
