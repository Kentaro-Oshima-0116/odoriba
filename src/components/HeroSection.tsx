import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full" style={{ height: 878 }}>
      {/* 背景写真 */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/hero-bg.jpg"
          alt="オドリバ ヒービジュアル"
          fill
          className="object-cover object-top"
          priority
        />
        {/* 上部グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" style={{ height: 300 }} />
      </div>

      {/* ナビゲーションバー */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-5 z-10">
        <span className="text-white font-black text-xl tracking-wider">ODORIBA</span>
        {/* ハンバーガーメニュー */}
        <button className="flex flex-col gap-1.5 p-2" aria-label="メニュー">
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </div>

      {/* 右上バッジ */}
      <div className="absolute top-11 right-4 z-10 w-[140px] h-[131px] flex items-center justify-center">
        <img src="/images/badge-top-right.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
        <div className="relative text-center font-black text-[#010101] leading-tight z-10">
          <p className="text-[20px]">北海道<br />最大級</p>
          <p className="text-[12px] mt-1">ストリート<br />ダンスイベント</p>
        </div>
      </div>

      {/* メインコピー */}
      <div className="absolute left-6 top-24 z-10">
        <h1 className="text-white font-black text-[40px] leading-[1.15] tracking-[-1.2px] whitespace-pre-line mb-4">
          {"踊る場所が、\nここにある。"}
        </h1>
        <p className="text-white/50 font-bold text-[17px] leading-tight whitespace-pre-line">
          {"ASAHIKAWA DANCE\nSHOWCASE EVENT"}
        </p>
      </div>

      {/* 日程・会場情報エリア（背景白半透明） */}
      <div className="absolute left-0 right-0 z-10" style={{ top: 560 }}>
        {/* 日程 */}
        <div className="px-6">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-sm font-bold text-[#010101]">2026</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-baseline">
              <span className="font-black text-[52px] leading-none text-[#010101]">9</span>
              <span className="font-black text-[28px] leading-none text-[#010101] mx-1">/</span>
              <span className="font-black text-[52px] leading-none text-[#010101]">5</span>
              <span className="font-bold text-[20px] text-[#010101] ml-1 mb-1">SAT</span>
            </div>
            <span className="text-[#010101] font-bold text-lg mx-1">・</span>
            <div className="flex items-baseline">
              <span className="font-black text-[52px] leading-none text-[#010101]">9</span>
              <span className="font-black text-[28px] leading-none text-[#010101] mx-1">/</span>
              <span className="font-black text-[52px] leading-none text-[#010101]">6</span>
              <span className="font-bold text-[20px] text-[#010101] ml-1 mb-1">SUN</span>
            </div>
            {/* 入場無料バッジ */}
            <div className="ml-auto flex flex-col items-center justify-center text-center leading-tight">
              <span className="font-black text-[#010101] text-sm">入場</span>
              <span className="font-black text-[#010101] text-sm">無料</span>
            </div>
          </div>
          <p className="text-sm font-bold text-[#010101] mt-1">AM10:00 OPEN</p>
        </div>

        {/* 会場 */}
        <div className="flex items-start gap-3 px-6 mt-3">
          <div className="flex items-stretch gap-2 shrink-0">
            <div className="w-0.5 bg-[#010101]" />
            <span className="font-bold text-sm text-[#010101] writing-vertical">会場</span>
            <div className="w-0.5 bg-[#010101]" />
          </div>
          <p className="font-bold text-sm text-[#010101] leading-relaxed">
            当麻スポーツセンター&<br />当麻町公民館まとまーる
          </p>
        </div>

        {/* CTAボタン */}
        <div className="flex gap-3 px-4 mt-6">
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#f62343] text-white font-bold text-[18px] rounded-full py-3 px-4">
            <span>チームで応募</span>
            <span className="text-base">→</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#d9d9d9] text-white font-bold text-[18px] rounded-full py-3 px-4">
            <span>個人で応募</span>
            <span className="text-base">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
