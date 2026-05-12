# Phase 5 — base の fluid 化 + タブレット中央寄せ (完了済み・履歴)

> **このドキュメントは履歴です。** Phase 5 は 4 commits (`8536161`, `1ec0018`, `96eac3e`, `389fd9b`) で完走済み。実装方針は概ねこの指示書通りに進んだ。現在の最新仕様は `AGENTS.md` を参照。
>
> 完了内容のサマリは `AGENTS.md` の「リファクタの進捗とフェーズ計画」セクション、commit log の `refactor: Phase 5` で確認できる。

---

リファクタの最終段。Phase 0〜4 + 6 が完了済みで残るのは Phase 5 のみ。**影響範囲が大きく視覚回帰が起きやすいため、対話的セッションで複数 viewport を見ながら進めるのが安全**。Codex / Claude 単独で一気に進めると detect されない崩れが残る可能性が高い。

## 現状の問題

`assets/css/style.css` には 2 つのレイヤーが共存している：

1. **base CSS (≤ 約 1320 行)** — Figma 375px 固定座標準拠の PC 風スタイル (`top: 595px` 等)
2. **`@media (max-width: 767px)` ブロック (約 1324〜1414 行)** — vw でスケールする SP 用上書き

タブレット (768–1023px) では SP override が外れ、base の 375px 固定がそのまま見える。`.page { max-width: 375px; margin: 0 auto }` 経由で中央寄せされるだけで、両側に黒背景が広がる素朴な状態。

PC (≥ 1024px) では更に `.pc-sidebar` + `.page { margin-left: 56vw }` で右にオフセット。

設計思想 (`AGENTS.md` 参照) では **base = SP デザインを単一ソース** にしたい。

## ゴール状態

- base CSS が SP デザインを単一ソースで表現
- `@media (max-width: 767px)` ブロックが**ほぼ消える** (本当に SP のみで必要な微調整だけ残す)
- タブレットでは `.page` を `max-width: 560px` 程度に拡張して中央寄せ
- PC は今のサイドバー方式を維持
- 5 つの代表 viewport (375 / 480 / 768 / 1024 / 1280) で意図通り

## 推奨タスク分解

### 5a. fluid 設計トークンの追加

`:root` に追加：

```css
:root {
  /* 既存 */
  --page-max: 375px;          /* SP デザイン基準。Phase 5 で 480/560 に拡張検討 */
  --page-pad: 24px;
  --content-width: min(327px, calc(100vw - 48px));

  /* Phase 5 で追加 */
  --page-max-sp: 480px;       /* SP デザインの自然な拡張上限 */
  --page-max-md: 560px;       /* タブレットでの中央寄せ幅 */
  --bp-md: 768px;             /* コメント用。CSS @media では使えない */
  --bp-lg: 1024px;
}
```

font-size の clamp ベース：

```css
:root {
  --fs-base: clamp(14px, 4.27vw, 17px);
  --fs-lg:   clamp(18px, 5.33vw, 22px);
  --fs-xl:   clamp(24px, 10.67vw, 48px);
  /* etc */
}
```

スケーラブル余白：

```css
:root {
  --space-1: clamp(8px, 2vw, 12px);
  --space-2: clamp(16px, 4vw, 24px);
  --space-3: clamp(24px, 6vw, 40px);
  /* etc */
}
```

具体的な breakpoint / clamp 値はデザイン確認しながら調整。

### 5b. Hero の fluid 化 (最重要・最重い)

現状は base に PC 値 (`top: 103px` 等) と SP 上書き (`top: 10.13vw` 等) の二重化。base を SP デザインに振り切って、PC では max-width で抑える方針：

1. `.hero { max-width: 375px; height: 878px; }` を `.hero { max-width: var(--page-max-md); height: clamp(813px, calc(813/375 * 100vw), Npx); }` 等に
2. `.hero__stack { padding-top: 103px; }` を `padding-top: 10.13vw` (SP 値) ベースに → PC で max-height による絞り
3. 装飾位置 (`.hero__brand-badge`, `.hero__deco--*`, `.hero__illust`, `.hero__free`) もすべて vw / clamp ベースに
4. `@media (max-width: 767px)` 内の Hero 関連ルールを順次削除

**注意**: SAT の microadjust (`.hero__day--sat { margin-bottom: 0.37em }`) と 入場無料バッジの位置 (SUN の 8px 右) は維持。

### 5c. その他セクションの fluid 化

Intro / Contents / Participate / Archive / FAQ / Access / Follow / Contact / Footer の SP override 内 vw 値を base に統合。

セクション内 padding は `var(--page-pad)` や `clamp()` で表現。文字サイズは `var(--fs-*)` トークンで。

`.section-head__jp { width: 260px }` 等の固定幅は `var(--content-width)` or `min(260px, 100%)` に。

### 5d. `.section-inner` ユーティリティ抽出 (Phase 3b の積み残し)

`width: var(--content-width); margin-inline: auto;` の 20+ 箇所の繰り返しを class 化。

```css
.section-inner {
  width: var(--content-width);
  margin-inline: auto;
}
```

各セクションの内側コンテナを `.section-inner` に置換。元々の `width: ... margin: N auto N` パターンは `.section-inner` + `margin-block: N N` に分解。

### 5e. タブレット中央寄せ (768–1023) の実装

```css
@media (min-width: 768px) and (max-width: 1023px) {
  .page {
    max-width: var(--page-max-md);  /* 560px */
    margin-inline: auto;
  }
  /* SP デザインがそのまま 560px 幅で中央寄せ。両脇は body bg (#1a1a1a) */
}
```

`.hero` などの個別 `max-width: 375px` は `inherit` または `var(--page-max-md)` に。

### 5f. PC レイアウトの再調整

`@media (min-width: 1024px)` 内：
- `.page { margin-left: 56vw; max-width: 375px }` の `max-width` をタブレットと揃えるか検討
- サイドバー幅 56vw と相対的なバランスを取る

### 5g. 残り `@media (max-width: 767px)` の整理

Phase 5b〜5e で大半は base に統合済みのはず。残るのは「SP でのみ必要な特殊調整」だけ。例えば:
- `.hero__brand-badge { left: 67.2%; top: -5.6vw }` のような特殊オフセット
- ハンバーガーメニューの位置

これらも可能なら base に統合 (`left: 67.2%` は SP でも PC でも同じ意味なので base に置ける)。

## コミット分割

巨大なフェーズなので分割推奨：

1. `refactor: Phase 5a - fluid 設計トークン追加`
2. `refactor: Phase 5b - Hero を fluid に統合`
3. `refactor: Phase 5c - 他セクションを fluid に統合`
4. `refactor: Phase 5d - .section-inner ユーティリティ抽出`
5. `refactor: Phase 5e - タブレット中央寄せを実装`
6. `refactor: Phase 5f-g - PC 調整と SP override の最終整理`

各コミット後に 375 / 480 / 768 / 1024 / 1280 の 5 幅で目視確認。

## 検証チェックリスト

- [ ] 5 つの viewport で Phase 4 完了時点と視覚的に同等以上
- [ ] `@media (max-width: 767px)` ブロックが大幅に減少 (現状約 90 行 → 目標 30 行以下)
- [ ] `@media (min-width: 768px) and (max-width: 1023px)` が新規追加されてタブレットで中央寄せ
- [ ] PC サイドバーが従来通り動作
- [ ] DevTools console にエラー無し
- [ ] レイアウトシフトが大きく出ていない

## 触らない既存調整

- `.hero__day--sat { margin-bottom: 0.37em }` (SAT の microadjust)
- 入場無料バッジ位置 (SUN の 8px 右)
- Archive marquee の JS 計算 (`--archive-loop-width` / `--archive-loop-duration`)
- Hero の z-index 階層 (illust:4 / stack:7 / free:8 / brand-badge:9 / menu:320)
