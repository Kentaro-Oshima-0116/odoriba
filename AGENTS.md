# AGENTS.md — odoriba プロジェクトの設計思想と作業ガイド

このファイルは Claude Code / Codex などの AI agent が新セッション開始時に自動で読み込む共有メモです。会話履歴は引き継がれないので、ここに「永続させたい文脈」をまとめています。

---

## プロジェクト概要

- **odoriba**: 北海道・当麻町で開催されるストリートダンスイベント「オドリバ」(2026年9月5–6日) の公式 LP
- 元は Next.js テンプレートから始まったが、現在は `index.html` + `assets/css/style.css` + `assets/js/main.js` のバニラ HTML/CSS/JS 構成
- デプロイ先は未確定。今は `index.html` を直接開けば動く

> 注: `README.md` は Next.js 時代の残骸でプロジェクト実態と合っていない。優先度低めだが書き換え予定。

---

## 設計思想（リファクタの北極星）

LP は Figma で 375px 幅で設計されている。レスポンシブの方針は **SP ファースト + PC 流用型**。

| breakpoint | レイアウト方針 |
|---|---|
| **SP (≤767px)** | ベース CSS が描く設計。fluid (rem / clamp / vw) で 480px 程度まで自然にスケール |
| **MD タブレット (768–1023px)** | SP デザインを中央寄せ。文字サイズ・余白の clamp() で微調整するだけで、レイアウト構造は変えない |
| **LG PC (≥1024px)** | 左に固定サイドバー (`.pc-sidebar`)、右に SP デザインをそのまま流用 |

### 派生する設計ルール

1. **ベース CSS = SP デザイン**。PC 用の絶対座標を base に書かない。
2. **タブレットでは構造を変えない**。SP デザインがそのまま伸びる前提。
3. **PC は装飾の追加のみ**（サイドバー、page を右にオフセット）で、ページ本体の CSS には触らない。
4. **fluid 優先**: `vw` / `clamp()` / `%` / `rem`。固定 px は意図的に使う場面のみ（細い border など）。
5. **Figma 座標準拠の magic number は段階的に解消**。`top: 595px` のような数値は、フェーズが進むごとに `margin-top: …` → `gap` / `padding` の構造に置き換える。

### breakpoint 変数

```css
/* style.css のヘッダーに記載 */
--bp-md: 768px;
--bp-lg: 1024px;
```

CSS の `@media` には変数が直接使えないので、media クエリ内で px リテラルを書きつつ、上記コメントで意図を残す。

---

## ファイル構成

```
odoriba/
├── AGENTS.md            ← このファイル
├── CLAUDE.md            ← `@AGENTS.md` を読み込むだけ
├── index.html
├── assets/
│   ├── css/style.css    ← 全 CSS。冒頭にも設計思想コメントあり
│   ├── js/main.js       ← 軽量 vanilla JS（メニュー開閉, IntersectionObserver, archive marquee 等）
│   └── images/          ← Figma から書き出した PNG/SVG
└── docs/
    └── PHASE_1C.md      ← Phase 1c 引き継ぎ指示書（既に完了済みの履歴ドキュメント）
```

---

## リファクタの進捗とフェーズ計画

`git log` を見ればフェーズの commit が並んでいます。

### 完了済み (`dev` ブランチ)

- **Phase 0** — CSS 変数の整備（`:root` に色・レイアウトトークン）、重複ルール削除
- **Phase 1a** — ヒーロー日付エリアを flex 化（11 個の絶対座標 → flex 縦並び + 横並びグループ）
- **Phase 1b** — タイトル・サブタイトル・会場の内部を flow 化。日付グループ化、ドット丸、入場無料 Figma 値適用
- **Phase 1c** — Hero 全体を `.hero__stack` で構造化、絶対配置を撤廃
- **Phase 2a** — 導入ブロック (intro / photo-strip / about / timetable) と画像 crop を整理
- **Phase 2b** — Contents カード画像 crop を整理
- **Phase 2c** — Participate のレイヤー構造整理
- **Phase 2d** — Archive marquee を JS 計算 + CSS 変数で動的化

### 未着手（次以降）

- **Phase 3** — FAQ / Access / Follow / Contact / Footer の整理（必要なら）
- **Phase 4** — PC サイドバー (`.pc-sidebar`) を `.btn` / `.site-menu` と共通化
- **Phase 5** — base を本格的に fluid 化（vw/clamp/rem への置換）。タブレットの中央寄せ仕様を実装。
- **Phase 6** — `README.md` を実態に合わせて書き換え

各フェーズは独立した commit にして `dev` に積む（個人開発なので PR は不要）。

---

## 命名規則・スタイル規約

### CSS

- **BEM ライク**: `.block__element--modifier`。例: `.hero__date-group`, `.hero__day--sat`
- **CSS 変数** は `:root` に集約。色は `--c-*`、レイアウトは `--page-*` `--content-width` など
- **z-index** は意味のある層で分離：
  - 装飾画像: `z-index: 4`
  - 構造要素（`.hero__stack` 等）: `z-index: 7`
  - 上層バッジ (`.hero__free`): `z-index: 8`
  - ブランドバッジ・固定 UI: `z-index: 9–320`
- **line-height は相対値推奨**（`1.25` などの倍率）。固定 px だと vw スケール時に行間が崩れる。Figma で `125% (21.25px)` のような値は `1.25` で書く。

### HTML

- 意味のあるラッパー名を付ける（`.hero__heading`, `.hero__date-group`）
- 装飾要素と構造要素を兄弟関係で並べ、構造側を `.hero__stack` などでまとめる

### キャッシュバスト

- `index.html` の `<link href="assets/css/style.css?v=YYYYMMDD-N">` を変更ごとに上げる。同じく `main.js?v=...` も。

---

## 注意・落とし穴

1. **Hero の高さは固定**: `.hero { height: 878px (PC) / calc(813/375 * 100vw) (SP) }`。`.hero__stack` を flow にしても hero 自体の高さは変わらない。中身が overflow すると `overflow: hidden` で切れる。
2. **`.hero__cta` は独立**: PC では `display: none`、SP では `position: absolute`。`.hero__stack` の中に入れない。
3. **装飾要素は触らない**: `.hero__illust`, `.hero__brand-badge`, `.hero__deco--*`, `.hero__free`, `.hero__menu` は絶対座標のままが正解。
4. **書き換え時の検証**: 必ず 3 つの幅（375 / 800 / 1280 程度）でブラウザ表示を確認してから commit。
5. **SAT の microadjust**: SAT のみ `margin-bottom: 0.37em` で SUN と視覚的に揃えている（`hero__day--sat`）。writing-mode の縦書きで S 位置がズレて見える問題への対処。
6. **Archive marquee のループ幅**: JS 側で `getBoundingClientRect` で計算し、CSS 変数 `--archive-loop-width` / `--archive-loop-duration` に設定する。アイテム幅を変えると勝手に追従する。

---

## 会話設計のお作法

- ユーザーは個人開発者で、デザイン仕様を Figma で持っている
- 大きな構造変更は段階的 (Phase 単位) に進める。フェーズごとに commit して動作確認
- ユーザーが「いい感じ」と言ったらコミット OK のシグナル
- ユーザーの意図が曖昧な時は推測せずに聞き返す（特に Figma 仕様との整合性）
- Codex と Claude Code の両方が交代で作業することがある。コミットメッセージとこのファイルが引き継ぎの主な手段
