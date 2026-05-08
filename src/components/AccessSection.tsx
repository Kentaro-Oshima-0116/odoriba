import Image from "next/image";
export default function AccessSection() {
  return (
    <section className="bg-white px-6 pt-10 pb-12">
      {/* 見出し */}
      <div className="mb-6">
        <p className="text-black/50 font-bold text-base">Access</p>
        <h2 className="text-black font-black text-[28px] leading-tight">会場・アクセス</h2>
      </div>

      {/* 会場名 */}
      <h3 className="font-black text-[24px] text-black leading-relaxed mb-2">
        当麻スポーツセンター&amp;<br />当麻町公民館まとまーる
      </h3>

      {/* 住所 */}
      <p className="text-[18px] text-black leading-relaxed mb-4">
        〒078-1313<br />北海道上川郡当麻町3条東2丁目11-3
      </p>

      {/* 地図 */}
      <div className="relative w-full rounded-lg overflow-hidden mb-6" style={{ height: 168 }}>
        <Image src="/images/access-map.jpg" alt="会場地図" fill className="object-cover" />
      </div>

      {/* アクセス手段 */}
      <div className="flex flex-col gap-4">
        {/* 電車 */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <img src="/images/icon-tram.svg" alt="電車" className="size-[26px] object-contain" />
            <span className="font-bold text-[18px] text-black">電車</span>
          </div>
          <p className="text-[16px] text-black leading-relaxed">
            <span className="font-bold">JR石北本線「当麻駅」</span><br />
            徒歩約10分（約800m）
          </p>
        </div>

        {/* バス */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <img src="/images/icon-bus.svg" alt="バス" className="size-[26px] object-contain" />
            <span className="font-bold text-[18px] text-black">バス</span>
          </div>
          <p className="text-[16px] text-black leading-relaxed">
            <span className="font-bold">道北バス「当麻線」</span><br />
            「当麻町役場前」徒歩約2分
          </p>
        </div>

        {/* 駐車場 */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <img src="/images/icon-car.svg" alt="駐車場" className="size-[26px] object-contain" />
            <span className="font-bold text-[18px] text-black">駐車場</span>
          </div>
          <p className="text-[16px] text-black leading-relaxed">
            <span className="font-bold">無料駐車場あり</span><br />
            詳細は後日掲載予定
          </p>
        </div>
      </div>
    </section>
  );
}
