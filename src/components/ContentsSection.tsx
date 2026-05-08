import Image from "next/image";

const cards = [
  {
    image: "/images/contents-card1.jpg",
    title: "ダンス\nショーケース",
    desc: "チーム・個人が成果を披露",
  },
  {
    image: "/images/contents-card2.jpg",
    title: "ダンスバトル",
    desc: "ジャンル別バトルコンテスト",
  },
  {
    image: "/images/contents-card3.jpg",
    title: "キッチンカー",
    desc: "フードを楽しみながら観覧",
  },
  {
    image: "/images/contents-card4.jpg",
    title: "その他出店",
    desc: "物販・グッズ等（後日公開）",
  },
];

export default function ContentsSection() {
  return (
    <section className="bg-[#292929] px-6 pt-10 pb-12">
      {/* 見出し */}
      <div className="mb-6">
        <p className="text-white/50 font-bold text-base">Contents</p>
        <h2 className="text-white font-black text-[28px] leading-tight">楽しみ方</h2>
      </div>

      <p className="text-white text-[18px] leading-relaxed mb-8">
        ショーケース、バトル、フード。それぞれが一つの舞台をつくる。
      </p>

      {/* カードグリッド */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="relative overflow-hidden rounded-lg aspect-[156/250]">
            <Image
              src={card.image}
              alt={card.title.replace("\n", " ")}
              fill
              className="object-cover"
            />
            {/* グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* テキスト */}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white font-black text-[20px] leading-[1.3] whitespace-pre-line mb-1">
                {card.title}
              </p>
              <p className="text-white text-[14px] leading-[1.4]">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
