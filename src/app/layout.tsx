import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Scale } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EquiLaw | 노동권리 AI 분석기",
  description:
    "AI-powered Korean labor law violation analyzer and complaint generator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background-alt`}
      >
        <header className="bg-navy text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="text-gold w-6 h-6" />
              <h1 className="text-xl font-bold tracking-tight">
                EquiLaw <span className="text-gold font-normal px-2">|</span>{" "}
                노동권리 AI 분석기
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
          {children}
        </main>
        <footer className="bg-navy text-white/60 text-sm py-6 text-center mt-auto">
          <div className="max-w-5xl mx-auto px-4">
            <p>
              본 서비스는 법률 상담을 대체할 수 없으며, 정확한 판단을 위해서는
              공인노무사 또는 변호사와 상담하시기 바랍니다.
            </p>
            <p className="mt-2">&copy; 2026 EquiLaw. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
