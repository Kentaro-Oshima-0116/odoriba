import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "ODORIBA | 旭川ダンスショーケースイベント",
  description: "北海道最大級のストリートダンスイベント「オドリバ」。2026年9月5日・6日、当麻スポーツセンター開催。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
