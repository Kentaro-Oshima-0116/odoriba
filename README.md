# odoriba

北海道・当麻町で開催されるストリートダンスイベント「**オドリバ**」の公式ランディングページ。

開催日: 2026年9月5日 (土) — 6日 (日)
会場: 当麻スポーツセンター & 当麻町公民館まとまーる

## 技術構成

- バニラ HTML / CSS / JavaScript (フレームワーク・ビルドツールなし)
- フォント: Google Fonts (Noto Sans JP / Roboto / Nunito Sans)
- 画像: Figma から書き出した PNG / SVG (`assets/images/`)

シンプルな静的サイトとして配信できる構成です。元は Next.js テンプレートから始まりましたが、現在は完全にバニラ構成に切り替わっています。

## 動かす

ローカルでは `index.html` を直接開けば動きます。フォントやキャッシュ周りで挙動が違うので、簡易 HTTP サーバ経由が推奨：

```bash
# Python 3 で
python3 -m http.server 8000

# または npx で
npx serve .
```

ブラウザで `http://localhost:8000` を開く。

## ディレクトリ構成

```
odoriba/
├── index.html              # 単一ページ HTML
├── assets/
│   ├── css/style.css       # 全 CSS (約 1500 行)
│   ├── js/main.js          # メニュー / IntersectionObserver / archive marquee
│   └── images/             # PNG / SVG
├── docs/
│   └── PHASE_1C.md         # 過去フェーズの引き継ぎ指示書
├── AGENTS.md               # AI agent 向けの設計思想・進捗ノート
├── CLAUDE.md               # Claude Code 用 (中身は AGENTS.md 参照のみ)
└── README.md               # このファイル
```

## 設計思想

- **SP ファースト**: ベース CSS が SP デザインを描く
- **MD タブレット (768–1023px)**: SP デザインを中央寄せ + 文字サイズ微調整
- **LG PC (≥ 1024px)**: 左に固定サイドバー (`.pc-sidebar`) + 右に SP デザインを流用

詳細は [AGENTS.md](./AGENTS.md) を参照。

## 開発

リファクタは Phase 単位で進めています。完了済みフェーズと未着手フェーズは [AGENTS.md](./AGENTS.md#リファクタの進捗とフェーズ計画) を参照。

コミットメッセージは `refactor:` / `fix:` / `docs:` プレフィックスで統一。
