# Phase 1c — Hero 全体構造の整理 (指示書)

このドキュメントは、`odoriba` リポジトリの Hero リファクタを引き継ぐための指示書です。Phase 0 / 1a / 1b は `dev` ブランチに既にマージ済み（`97ffcf5` 時点）。Phase 1c はその続きです。

---

## 背景・全体方針

このプロジェクトは Figma の 375px 固定デザインを元にしたバニラ HTML/CSS/JS のランディングページ。リファクタの全体方針は以下：

1. **SP ファースト**: ベース CSS が SP デザインを記述する
2. **タブレット (768–1023px)**: SP デザインを中央寄せして文字サイズ等を微調整
3. **PC (≥ 1024px)**: 左に固定サイドバーを置き、右に SP デザインをそのまま流用

リファクタは段階的に進めており、現在までの進捗は `git log dev` を参照（`refactor: Phase 0` / `Phase 1a` / `Phase 1b` のコミットを見れば全体像が掴める）。

---

## Phase 1c の目的

Hero セクション内の構造要素を flow ベースの単一コンテナ `.hero__stack` にまとめ、装飾要素は別レイヤーに分離する。これにより：

- Hero 内で残っている絶対座標 (`top: 595px` など) を縦並びの flex で表現できる
- 構造（title / date / venue / cta）と装飾（illust / badge / deco / brand-badge）が明確に分離
- 後続フェーズ（SP の fluid 化、タブレット対応）の足場ができる

---

## 現状の構造

`index.html` の `<section class="hero">` 内の要素：

| 要素 | 役割 | 現状の配置 |
|---|---|---|
| `.hero__menu` (button) | ハンバーガー | `position: fixed` (viewport 右上) — そのまま |
| `.hero__heading` | タイトル + サブタイトル | `position: absolute; left: 26px; top: 103px` |
| `.hero__brand-badge` | 北海道最大級の緑円 | `position: absolute; left: 252px; top: 44px` |
| `.hero__illust` | ダンサーのメイン画像 (hero.png) | `position: absolute; left: 0; top: 181px; w375 h533` |
| `.hero__deco--tl` `--tr` `--mr` | 装飾画像 (赤/青の図形) | `position: absolute` |
| `.hero__date` | 年・日付・OPEN 時刻 (内部は flex 縦並びで実装済み) | `position: absolute; left: 24px; top: 595px` |
| `.hero__free` | 入場無料バッジ | `position: absolute; left: 242px; top: 590px` |
| `.hero__venue` | 会場 (内部は flex 横並びで実装済み) | `position: absolute; left: 24px; top: 701px` |
| `.hero__cta` | チームで応募 / 個人で応募ボタン | `position: absolute; left: 16px; top: 777px` (PC では `display: none`) |

各要素の SP override は `@media (max-width: 767px)` ブロック内で `top: Nvw` 等で 375 基準のスケールを保持。

---

## 目指す構造

```html
<section class="hero">
  <!-- 装飾レイヤー: 絶対配置のまま残す -->
  <button class="hero__menu">…</button>
  <div class="hero__brand-badge">…</div>
  <img class="hero__deco hero__deco--tl" />
  <img class="hero__deco hero__deco--tr" />
  <img class="hero__deco hero__deco--mr" />
  <img class="hero__illust" />
  <div class="hero__free">…</div>

  <!-- 構造レイヤー: flow で縦並び -->
  <div class="hero__stack">
    <div class="hero__heading">…</div>
    <div class="hero__date">…</div>
    <div class="hero__venue">…</div>
  </div>

  <!-- CTA は SP fixed/absolute / PC は非表示なので独立 -->
  <div class="hero__cta">…</div>
</section>
```

`.hero__stack` の責務：

- `position: relative; z-index: 7;`（装飾より前面）
- `display: flex; flex-direction: column;`
- `padding-top` で `.hero__heading` を `top: 103px` 相当の位置に
- 各セクション間は **margin / gap** で間隔を表現（マジックナンバーは Figma 由来の絶対座標差分から導出）

各セクション要素 (`.hero__heading`, `.hero__date`, `.hero__venue`) からは `position: absolute; left; top;` を撤廃し、`margin-top` 等で位置を表現する。

---

## 推奨ステップ

### Step 1: HTML 再構成

`index.html` の `<section class="hero">` 内：

1. 装飾要素 (`hero__menu` / `hero__brand-badge` / `hero__deco--*` / `hero__illust` / `hero__free`) を先頭に集める
2. `.hero__stack` 要素を追加し、`hero__heading` / `hero__date` / `hero__venue` をその中へ移動
3. `.hero__cta` は `.hero__stack` の外（兄弟）に置く

### Step 2: CSS — 構造側

`.hero__stack` を新規追加：

```css
.hero__stack {
  position: relative;
  z-index: 7;
  display: flex;
  flex-direction: column;
  padding: 103px 0 0;  /* title top の 103px を padding で表現 */
  pointer-events: none;  /* 子の必要箇所だけ pointer-events: auto で復活 */
}
```

各セクション要素から absolute 系を削除：

- `.hero__heading`: `position: absolute; left: 26px; top: 103px;` を削除。代わりに `padding-inline: 26px;` 程度、もしくは `.hero__stack` 側で `padding: 103px 26px 0;` してもよい。`width: 320px` も再検討（fluid 化の前段階としては固定でも可）。
- `.hero__date`: `position: absolute; left: 24px; top: 595px;` を削除。`margin-top: 348px;`（= 595 - title top 103 - heading height 144 = 348） 程度。`margin-left: 24px;`（または `.hero__stack` 全体に 24px padding） で位置調整。
- `.hero__venue`: `position: absolute; left: 24px; top: 701px;` を削除。`margin-top: 14px;`（= 701 - 687 = 14）程度。

実際の値は Figma の絶対座標から逆算する（既存 CSS にコメントとして書いてある）。

### Step 3: CSS — SP override

`@media (max-width: 767px)` ブロック内で対応する `top: Nvw` 系のルールを **削除** または `margin-top: Nvw` に書き換える。

例:
```css
/* before */
.hero__heading { left: 6.93%; top: 10.13vw; width: 85.33%; }
.hero__date { left: 6.4%; top: 141.33vw; }
.hero__venue { left: 6.4%; top: 169.6vw; }

/* after */
.hero__stack { padding: 10.13vw 6.93% 0; }
.hero__heading { /* left/top/width 不要 */ }
.hero__date { margin-top: ?vw; margin-left: ?vw; }
.hero__venue { margin-top: ?vw; }
```

vw 値は既存の数値から差分計算（PC 値と同じ要領）。

### Step 4: 装飾要素はそのまま

`.hero__menu` / `.hero__brand-badge` / `.hero__deco--*` / `.hero__illust` / `.hero__free` / `.hero__cta` は **触らない**。これらは絶対座標のまま、`.hero` を基準にレイアウトされる。

`.hero__stack` の `z-index: 7` で構造要素は装飾より前面に。`.hero__illust` (z-index: 4) より高くなる。

### Step 5: 視覚確認

ブラウザで 3 つの幅で確認：

| 幅 | 期待動作 |
|---|---|
| 375px (SP) | Phase 1b と同じ見た目 |
| 800px (tablet) | Phase 1b と同じ見た目（ベース px 値が効く） |
| 1280px (PC) | サイドバーが左に固定され、右に Hero が 375px max-width で表示 |

各セクションの top y 座標が Figma 値 (103 / 595 / 701) に対して ±2px 以内であれば OK。

---

## 注意点・落とし穴

### 1. `.hero` の高さ

`.hero { height: 878px; }` (PC base) / `calc(813 / 375 * 100vw)` (SP) は固定。`.hero__stack` を flow にしても、`.hero` 自体の高さは維持される。`.hero__stack` 内の要素合計高さが `.hero` の高さを超えると `overflow: hidden` で切れる。

合計高さの目安（PC）：
- padding-top 103 + heading 144 + date-margin 348 + date 92 + venue-margin 14 + venue 48 = 749px
- CTA は別レイヤーで top: 777px
- Hero 高さ 878px、CTA bottom 826px、余裕 52px

### 2. `.hero__cta` の扱い

`.hero__cta` は `.hero__stack` の外に出す。理由：
- PC で `display: none` (サイドバーがあるため)
- SP で `position: absolute; top: 189.87vw;` (ヒーロー下端 + 4.27vw 余白)

flow に組み込むと、PC で `display: none` した時に他の要素が詰まる挙動になりかねないので、独立した absolute レイヤーのままが安全。

### 3. `.hero__date` の内部構造

`.hero__date` は Phase 1a で内部が flex column になっている：
```html
<div class="hero__date">
  <p class="hero__year">2026</p>
  <p class="hero__dates">
    <span class="hero__date-group">9 / 5 SAT</span>
    <span class="hero__dot"></span>
    <span class="hero__date-group">9 / 6 SUN</span>
  </p>
  <p class="hero__open">AM10:00 OPEN</p>
</div>
```

`.hero__date` 自体から `position: absolute; left; top;` を削除しても、内部の flex column 構造はそのまま動く。`display: flex; flex-direction: column;` は維持。

### 4. 視覚揃え (SAT の microadjust)

Phase 1b の最後で SAT のみ `margin-bottom: 0.37em` の microadjust を入れている（`97ffcf5`）。この値はそのまま残す。

### 5. `.hero__free` の left 値

Phase 1b の最後で `.hero__free { left: 242px; right: 10.93% (SP); }` に調整した。これは SUN の 8px 右に追従させたもの。`.hero__date` を flow に変えると `.hero__dates` の幅は変わらないので、SUN の x 座標も基本変わらない。バッジ位置はそのまま OK。

ただし `.hero__date` を `.hero__stack` (`margin-inline: 24px` / `padding-inline: 26px` 等) の内側に置くと、`.hero__date` の x 開始位置が `.hero__stack` の padding に依存することになる。`.hero__free` は `.hero` 直下なので `.hero__stack` の padding 影響を受けない。`.hero__date` 内の SUN の絶対 x 座標を変えないように `.hero__stack` の左 padding を 24 (`.hero__date` の旧 left 値) に揃えるか、`.hero__date` 個別に `margin-left` 調整する。

### 6. キャッシュバスト

`index.html` の `<link href="assets/css/style.css?v=...">` のバージョンを上げる。Phase 1b 終了時点で `?v=20260511-36`。

---

## 検証項目

1. Phase 1b と視覚的に同じ（少なくとも 3 つの viewport で）
2. `.hero__heading`, `.hero__date`, `.hero__venue` から `position: absolute` が消えている
3. SP override の `top: Nvw` も該当ルールから削除されている
4. ブラウザのデバッグツールで、`.hero__stack` の中身が縦並び flex として展開されている
5. CTA / バッジ / 装飾画像は元の位置のまま動かない

---

## このフェーズで触らないもの

- `.hero__cta` 関連 CSS
- `.hero__brand-badge` / `.hero__illust` / `.hero__deco--*` / `.hero__menu` / `.hero__free`
- PC サイドバー (`.pc-sidebar`) 関連
- Hero 以外のセクション (`photo-strip` 以降)

Phase 2 / 3 / 4 で扱う予定。

---

## 完了後

`refactor: Phase 1c - Hero 全体構造を hero__stack で整理` の commit を `dev` ブランチに積む。コミットメッセージは Phase 0 / 1a / 1b の形式を踏襲。

その後、リファクタの全体プラン（Phase 2: タブレット対応 / Phase 3: 他セクション fluid 化 / Phase 4: PC サイドバー共通化）に進む。
