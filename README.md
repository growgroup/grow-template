# Grow Template

Gulp, Sass & Jade を利用した必要最小限のプロジェクトテンプレートです。

より効率的なHTMLコーディングを実現するために作成しています。

なお、最終的に WordPress の子テーマとしての利用を前提として作成しています。

要望・改善点等は issues へお願いします。

## 必要なモジュール/ソフト

必要なモジュール/ソフトは下記の通りです。

Homebrew、もしくはその他の方法でインストールすること。

* node.js
* gulp
* bower
* git
* editorconfig (各IDE, テキストエディタのプラグイン/パッケージ)

## インストール

```shell
git clone https://github.com/growgroup/grow-template
```

もしくは **Download** ボタンからダウンロードし、プロジェクトルートディレクトリへ展開してください。

ディレクトリの用意ができたら下記のコマンドを入力してください。

```shell
npm run-script init
```

npm install と bower install コマンドが実行されます。


## ディレクトリ構成

基本的に、app ディレクトリ内の静的ファイルを Gulp で操作後、
dist ディレクトリ内に展開します。

```json
.
├── README.md
├── app
│   ├── assets
│   │   ├── fonts
│   │   ├── images
│   │   ├── js
│   │   └── scss
│   │       ├── base
│   │       ├── components
│   │       ├── layout
│   │       └── style.scss
│   ├── inc
│   │   ├── components
│   │   ├── core
│   │   │   └── _base.jade
│   │   └── layouts
│   │       ├── _aside.jade
│   │       ├── _footer.jade
│   │       └── _header.jade
│   └── index.jade
├── bower.json
├── bower_components/
├── dist
│   ├── assets
│   │   ├── css
│   │   │   └── style.css
│   │   └── js
│   │       ├── main.js
│   │       ├── scripts.js
│   │       └── vendor.js
│   └── index.html
├── docs
├── gulpfile.babel.js
├── jade-settings.json
└── package.json

```

## 作業の進め方

### Jade

##### jade-settings.json の編集

jade-settings.json ファイルの値を変更することで、
自動的に変数に値がセットされ、HTMLにコンパイル時に反映されます。

```json5
{
  "general" : {
    "title" : "Grow Template", // サイト名
    "description" : "Grow Template", // サイトの説明文
    "keywords" : "Grow Template", // サイトのキーワード
    "viewport" : "width=device-width,initial-scale=1", // ビューポート
    "favicon" : "favicon.ico", // ファビコンへのパス
    "apple-touch-icon" : "apple-touch-icon.png", // iOS アイコンへのパス
    "ogp" : { // OGP の各値
      "locale" : "ja_JP",
      "type" : "website",
      "title":  "Grow Template",
      "description":  "Grow Template",
      "url":  "",
      "site_name":  "Grow Template",
      "image" : "ogp.jpg"
    }
  },

  "assets" : {
    "styles": [
      "assets/css/style.css" // CSS ファイルへのパス
    ],
    "scripts": [
      "assets/js/main.js" // JavaScript ファイルへのパス
    ]
  },

  "pages" : {
    // トップページの設定
    "home" : {
      "title" : "トップページ",
      "description" : "ページの説明文",
      "keywords" : "ページのキーワード"
    },
    // 例 : 会社概要ページ
    "about" : {
      "title" : "会社概要",
      "description" : "このページではサンプル会社の概要について説明しています",
      "keywords" : "サンプル会社, サンプル"
    },

    // ...ページを増やすごとに追加
  }
}
```

### Sass

本テンプレートでは SCSS を採用しています。  
また CSSのコーディングルールとしてFLOCSSにて統一しています。

[https://github.com/hiloki/flocss](https://github.com/hiloki/flocss)


##### Function & mixin


### JavaScript

##### ESLint について

JavaScript の構文チェッカーとして ESLint を採用しています。

[http://eslint.org/](http://eslint.org/)


### Bower

本テンプレートでは、```bower_components``` ディレクトリ内に ``` bower install ``` コマンドで追加したパッケージが格納されます。

* [Bower](http://bower.io/)

### StyleGuide

スタイルガイドは [sc5-styleguide](https://github.com/SC5/sc5-styleguide/pulls) を導入しています。  
gulp を実行している際に、初期状態では 8888 ポートで閲覧することができます。

### その他

* [HTMLコーディング規約](docs/RULES_HTML_CODING.md)
* [命名規則](docs/RULES_NAMING.md)


