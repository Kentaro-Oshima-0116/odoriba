import Image from "next/image";

const photos = [
  { src: "/images/archive1.jpg", alt: "アーカイブ1" },
  { src: "/images/archive2.jpg", alt: "アーカイブ2" },
  { src: "/images/archive3.jpg", alt: "アーカイブ3" },
];

export default function ArchiveSection() {
  return (
    <section className="bg-[#0b0b0b] pt-10 pb-12">
      {/* 見出し */}
      <div className="px-6 mb-3">
        <p className="text-white/50 font-bold text-base">Archive</p>
        <h2 className="text-white font-black text-[28px] leading-tight">オドリバハイライト</h2>
      </div>
      <p className="text-white text-[18px] leading-relaxed px-6 mb-6">
        過去の熱気をご覧ください。
      </p>

      {/* 横スクロール写真 */}
      <div className="flex gap-0 overflow-x-auto scrollbar-none">
        {photos.map((photo) => (
          <div key={photo.src} className="relative shrink-0" style={{ width: 241, height: 362 }}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* STOPボタン */}
      <div className="flex justify-end px-6 mt-4">
        <button className="border border-white text-white font-bold text-sm rounded-full px-6 py-1.5">
          STOP
        </button>
      </div>
    </section>
  );
}
