"use client";

import { useState } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <section className="bg-white px-6 pt-10 pb-12">
      {/* 見出し */}
      <div className="mb-4">
        <p className="text-black/50 font-bold text-base">Contact</p>
        <h2 className="text-black font-black text-[28px] leading-tight">お問い合わせ</h2>
      </div>

      <p className="text-[16px] text-black leading-relaxed mb-6">
        出演者への個別のお問い合わせは各出店者窓口までお願いします。
      </p>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* お名前 */}
        <div>
          <label className="block font-bold text-[18px] text-black mb-2">お名前</label>
          <input
            type="text"
            placeholder="山田太郎"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#c8c8c8] rounded px-4 py-3 text-[18px] text-black placeholder-[#bfbfbf] outline-none focus:border-[#f62343] transition-colors"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block font-bold text-[18px] text-black mb-2">メールアドレス</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#c8c8c8] rounded px-4 py-3 text-[18px] text-black placeholder-[#bfbfbf] outline-none focus:border-[#f62343] transition-colors"
          />
        </div>

        {/* お問い合わせ内容 */}
        <div>
          <label className="block font-bold text-[18px] text-black mb-2">お問い合わせ内容</label>
          <textarea
            placeholder="ご質問・ご相談内容をご記入ください"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border border-[#c8c8c8] rounded px-4 py-3 text-[18px] text-black placeholder-[#bfbfbf] outline-none focus:border-[#f62343] transition-colors resize-none"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="mx-auto flex items-center justify-center gap-2 bg-black text-white font-bold text-[18px] rounded-full py-3"
          style={{ width: 263 }}
        >
          <span>送信する</span>
          <span>→</span>
        </button>
      </form>
    </section>
  );
}
