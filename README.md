# 日本国憲法改正草案（自民党、平成24年）現行憲法対照ビューワー

本ページは、平成24年4月27日に自由民主党の憲法改正実現本部によって決定された日本国憲法改正草案について、現行憲法との対照をGitHub風のUIで差分表示するためのビューワーです。

## 備考

- 自由民主党 憲法改正実現本部が公開している日本国憲法改正草案（現行憲法対照）PDFファイルをもとに、改正草案と現行憲法をそれぞれMarkdownで構造化したテキストを使用している。
- 章は見出しレベル2、条は見出しレベル3とした。
- 項は行に対応するものとみなし、算用数字や丸囲み数字は省略した。
- 漢数字を用いて表現された箇条書きは、Markdown記法に従い番号付きリストに置き換えた。
- 改正草案では条見出しの前に括弧囲みで要約が付されているが、これは条見出しのすぐ後に移動した。
- 改正草案の附則については適当に見出しをつけて構造化した。
- 改正草案の冒頭に含まれる目次は省略した。

## 参考文献

- 日本国憲法改正草案 | 資料 | 自由民主党 憲法改正実現本部
  - https://www.jimin.jp/constitution/document/draft/
- atsuya/constitution-of-japan
  - https://github.com/atsuya/constitution-of-japan

## 利用ライブラリ

- astro
  - https://www.npmjs.com/package/astro
- react
  - https://www.npmjs.com/package/react
- @astrojs/react
  - https://www.npmjs.com/package/@astrojs/react
- react-dom
  - https://www.npmjs.com/package/react-dom
- jsdiff
  - https://www.npmjs.com/package/diff
