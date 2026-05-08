export default function ParticipateSection() {
  return (
    <section className="px-6 py-10">
      {/* 見出し */}
      <div className="mb-3">
        <p className="text-black/50 font-bold text-base">Participate</p>
        <h2 className="text-black font-black text-[28px] leading-tight">参加する</h2>
      </div>

      <p className="text-black text-[18px] leading-relaxed mb-8">
        ショーケース・バトル、<br />どちらへの参加も受け付けています。
      </p>

      {/* チームエントリーカード */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "#f5f5f5" }}>
        <div className="p-6 pb-8">
          <h3 className="text-black font-black text-2xl text-center mb-2">チームエントリー</h3>
          <p className="text-black/70 text-sm text-center leading-relaxed mb-6">
            エントリー期間<br />2026年XX月XX日〜XX月XX日
          </p>
          <button className="w-full flex items-center justify-center gap-2 bg-[#f62343] text-white font-bold text-[18px] rounded-full py-3">
            <span>チームで応募</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* 個人エントリーカード */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#f5f5f5" }}>
        <div className="p-6 pb-8">
          <h3 className="text-black font-black text-2xl text-center mb-2">個人エントリー</h3>
          <p className="text-black/70 text-sm text-center leading-relaxed mb-6">
            エントリー期間<br />2026年XX月XX日〜XX月XX日
          </p>
          <button className="w-full flex items-center justify-center gap-2 bg-[#d9d9d9] text-white font-bold text-[18px] rounded-full py-3">
            <span>Coming Soon…</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
