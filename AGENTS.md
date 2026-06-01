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

LP は Figma で 375px 幅で設計されているが、Phase 5 で **container query + cqw ベースの fluid 設計**に移行済み。SP/MD/PC で同じ 480 デザインが container width に応じてスケールする一本化アーキテクチャ。

| 範囲 | レイアウト |
|---|---|
| **0–479px** | `.page` が viewport 幅まで広がる。cqw で内容が等比スケール |
| **480–1279px** | `.page` 480 で中央寄せ、両脇に body bg (#1a1a1a)。サイドバー無し |
| **≥ 1280px** | 左に固定サイドバー `.pc-sidebar` 56vw + `.page` 480 右側 |

### 派生する設計ルール

1. **ベース CSS = SP デザイン**。`.page` は `container-type: inline-size`、内側のサイズ単位は `cqw` (= % of .page width) を優先。
2. **タブレットでは構造を変えない**。SP デザインがそのまま 480 で頭打ちして中央寄せされる。
3. **PC はサイドバー追加のみ** (`.page { margin-left: 56vw }`)。ページ本体は SP/MD と同じ。
4. **fluid 優先**: 主に `cqw` / `%` / `clamp()` / `rem`。viewport 単位の `vw` は `.pc-sidebar` 等の viewport bound 要素のみ。
5. **不要な base PX 値を残さない**。cqw rule が override する PX 値は dead code として削除する。

### breakpoint

PC サイドバー出現は `1280px`。MD と PC の境界がここ。`@media (min-width: 1280px)` で `.pc-sidebar` 表示と `.page` の右オフセットを制御。それ以外の breakpoint は不要 (cqw で全部スケールするため)。

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
- **Phase 3** — `line-height` の固定 px (14 種) を相対値に統一、FAQ の `.faq__text` を flex: 1 に
- **Phase 4** — PC サイドバーボタンと site-menu ボタンの CSS 共通化 (重複約 60 行削除)
- **Phase 5** — base を fluid 化 + タブレット中央寄せ + PC 統合 (4 commits)
  - 5 (1/N): `.page` を container query 化 (`container-type: inline-size`, max-width 480) + SP override の vw を cqw に置換
  - 5 (2/N): PC breakpoint を 1024 → 1280 に。1024-1279 は MD 扱い。`.page` / `.site-menu` の max-width/width を 480 に。SP/MD wrapper を撤廃し cqw rules を base に格上げ
  - 5 (3/N): cqw rules が override する base PX 値を dead code として削除 (30 行純削減)
  - 5 (4/N): 15 セクションが個別に持っていた `width: var(--content-width); margin-inline: auto` を共通 comma セレクタ rule に集約
- **Phase 6** — `README.md` を Next.js 残骸からプロジェクト実態に書き換え

リファクタの主要 Phase は全て完走。残課題があれば後続 Phase で対応。

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

## 個人エントリー公開時の手順（2026年7月20日〜予定）

**運用方針（ミーティングで決定）**: 公開版を**別ファイルとして用意しておき、期間が来たらそれをさくらサーバーにデプロイ**する。本番の `index.html` 自体は触らず、差し替えで対応する。

- **現行（公開前）**: `index.html` … 個人エントリーは無効（グレー）表示
- **公開版（待機中）**: `index-personal-open.html` … 個人エントリーを有効化（青 `#2170F7` `.cta--blue` / `.entry-card--personal--live`）。CSS は共通の `assets/css/style.css`（青スタイル仕込み済み）を参照
- 公開版で有効化済みの個人エントリー = 5箇所（PCサイドバー / ヒーロー / 追従CTA / サイトメニュー / 参加カード）。タイムテーブルボタン（`8月中旬…`）は個人エントリーではないので対象外
- サイトメニューの「Coming Soon…」は公開版では「個人エントリー」表記に変更済み

個人エントリーの EventPay URL は確定済み: `shop_code=3348145615424627&search_category_id=19162`（チームは `19161`）。`index-personal-open.html` の 5 箇所に反映済みで、**そのままデプロイ可能**。

### 公開日にやること

1. さくらサーバーに `index-personal-open.html` を **`index.html` として** アップロード（上書きデプロイ）。**`assets/css/style.css`（青スタイル入り）も忘れず一緒にアップ**。
2. キャッシュバスト（`style.css?v=` 等）を上げると確実。

### 補足

- 青ボタンの白ツヤ・矢印アイコンは赤ボタン（`.cta--red`）の流用。公開前に Figma で青状態の見た目を最終確認すると確実。

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
