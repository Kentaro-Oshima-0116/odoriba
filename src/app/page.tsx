import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import ContentsSection from "@/components/ContentsSection";
import ParticipateSection from "@/components/ParticipateSection";
import ArchiveSection from "@/components/ArchiveSection";
import FaqSection from "@/components/FaqSection";
import AccessSection from "@/components/AccessSection";
import FollowUsSection from "@/components/FollowUsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="max-w-[375px] mx-auto overflow-x-hidden">
      {/* ヒーローセクション */}
      <HeroSection />

      {/* フォトストリップ */}
      <div className="flex" style={{ height: 130 }}>
        <div className="relative overflow-hidden" style={{ width: 130, height: 130 }}>
          <Image src="/images/hero-bg.jpg" alt="オドリバ写真1" fill className="object-cover" />
        </div>
        <div className="flex-1 bg-[#f5f5f5]" />
      </div>
      <div className="flex" style={{ height: 130 }}>
        <div className="flex-1 bg-[#f5f5f5]" />
        <div className="relative overflow-hidden" style={{ width: 130, height: 130 }}>
          <Image src="/images/hero-bg2.jpg" alt="オドリバ写真2" fill className="object-cover" />
        </div>
      </div>

      {/* アバウトテキスト */}
      <div className="px-6 py-8 bg-white">
        <p className="text-black text-[18px] leading-relaxed">
          北海道・当麻町を舞台に、<br />ダンスの熱気が<br />2日間にわたって広がります。
        </p>
      </div>

      {/* タイムテーブルセクション */}
      <div className="px-6 pb-10 bg-white">
        <p className="text-black text-[18px] leading-relaxed mb-6">
          タイムテーブルは後日公開予定。<br />公式Instagramをご確認ください。
        </p>
        <div className="flex justify-center">
          <button
            className="flex items-center justify-center gap-2 border border-[#c8c8c8] text-black font-bold text-[18px] rounded-full py-3"
            style={{ width: 263 }}
          >
            <span>Coming Soon…</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* 楽しみ方セクション */}
      <ContentsSection />

      {/* 全幅写真セパレーター */}
      <div className="relative w-full" style={{ height: 280 }}>
        <Image src="/images/hero-bg2.jpg" alt="オドリバ" fill className="object-cover" />
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent" style={{ height: 100 }} />
      </div>

      {/* 参加するセクション */}
      <ParticipateSection />

      {/* アーカイブセクション */}
      <ArchiveSection />

      {/* FAQセクション */}
      <FaqSection />

      {/* アクセスセクション */}
      <AccessSection />

      {/* フォローアスセクション */}
      <FollowUsSection />

      {/* お問い合わせセクション */}
      <ContactSection />

      {/* フッター */}
      <footer className="bg-[#0b0b0b] text-white/50 text-sm text-center py-6">
        <p>© 2026 ODORIBA All rights reserved.</p>
      </footer>
    </main>
  );
}
