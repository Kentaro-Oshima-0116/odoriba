import Image from "next/image";

export default function FollowUsSection() {
  return (
    <section className="bg-[#f5f5f5] px-6 py-10">
      {/* FOLLOW US! */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-[#010101] font-bold text-2xl">❮</span>
        <h2 className="font-black text-[24px] text-black">FOLLOW US !</h2>
        <span className="text-[#010101] font-bold text-2xl">❯</span>
      </div>

      <p className="text-black text-[16px] text-center leading-relaxed mb-6">
        最新情報・タイムテーブルはInstagramで
      </p>

      {/* Instagramボタン */}
      <div className="flex justify-center">
        <a
          href="https://www.instagram.com/odoriba_official"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-black rounded-[24px] px-5 py-3"
          style={{ width: 263 }}
        >
          <div className="relative size-10 rounded-full overflow-hidden shrink-0">
            <Image src="/images/instagram-icon2.png" alt="Instagram" fill className="object-cover" />
          </div>
          <span className="text-white font-bold text-[16px]">@odoriba_official</span>
          <img src="/images/instagram-icon.svg" alt="" className="ml-auto size-[29px] object-contain" />
        </a>
      </div>
    </section>
  );
}
