"use client";

import { useState } from "react";
const participantFaqs = [
  { q: "入場は無料ですか？" },
  { q: "開場・終演時間を教えてください。" },
  { q: "子どもや家族連れでも楽しめますか？" },
  { q: "雨天の場合、開催はどうなりますか？" },
  { q: "会場内で飲食はできますか？" },
  { q: "途中入退場はできますか？" },
  { q: "駐車場はありますか？" },
  { q: "会場内で写真・動画を撮影できますか？" },
  { q: "車椅子での来場は可能ですか？" },
  { q: "タイムテーブルはどこで確認できますか？" },
];

export default function FaqSection() {
  const [activeTab, setActiveTab] = useState<"participant" | "visitor">("visitor");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = participantFaqs;

  return (
    <section className="bg-[#f5f5f5] px-6 pt-10 pb-10">
      {/* 見出し */}
      <div className="mb-4">
        <p className="text-black/50 font-bold text-base">FAQ</p>
        <h2 className="text-black font-black text-[28px] leading-tight">よくある質問</h2>
      </div>

      {/* タブ */}
      <div className="flex mb-6">
        <button
          className="flex-1 text-center pb-2 font-bold text-[18px] border-b-2 transition-all"
          style={{
            color: activeTab === "participant" ? "#000" : "rgba(0,0,0,0.3)",
            borderColor: activeTab === "participant" ? "#333" : "transparent",
          }}
          onClick={() => setActiveTab("participant")}
        >
          参加者向け
        </button>
        <button
          className="flex-1 text-center pb-2 font-bold text-[18px] border-b-2 transition-all"
          style={{
            color: activeTab === "visitor" ? "#000" : "rgba(0,0,0,0.3)",
            borderColor: activeTab === "visitor" ? "#333" : "transparent",
          }}
          onClick={() => setActiveTab("visitor")}
        >
          来場者向け
        </button>
      </div>

      {/* FAQ一覧 */}
      <div className="flex flex-col">
        {faqs.map((faq, i) => (
          <button
            key={i}
            className="flex flex-col items-start pb-4 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="flex items-start gap-2 pb-4 w-full">
              {/* Qバッジ */}
              <div className="relative shrink-0 size-[31px]">
                <img src="/images/faq-circle.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-[14px] text-black">Q</span>
              </div>
              <p className="flex-1 font-bold text-[18px] text-black leading-relaxed">{faq.q}</p>
              {/* プラスアイコン */}
              <div className="mt-2 shrink-0 flex items-center justify-center size-4">
                <span className="font-bold text-black text-xl leading-none">
                  {openIndex === i ? "−" : "+"}
                </span>
              </div>
            </div>
            <div className="w-full h-px bg-[#c2c2c2] opacity-50" />
          </button>
        ))}
      </div>
    </section>
  );
}
