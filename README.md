# Grow Template [![Build Status](https://travis-ci.org/growgroup/grow-template.svg?branch=master)](https://travis-ci.org/growgroup/grow-template)

Gulp, Sass & Pug を利用した必要最小限のプロジェクトテンプレートです。

より効率的なHTMLコーディングを実現するために作成しています。

なお、最終的に WordPress の子テーマとしての利用を前提として作成しています。

要望・改善点等は issues へお願いします。

## 必要なモジュール/ソフト

必要なモジュール/ソフトは下記の通りです。

Homebrew、もしくはその他の方法でインストールすること。

* node >=6.3.1 
* bower >= 1.7.9
* gulp >= 3.9.1
* git
* editorconfig (各IDE, テキストエディタのプラグイン/パッケージ)

## インストール

```shell
git clone https://github.com/growgroup/grow-template
```

もしくは **Download** ボタンからダウンロードし、プロジェクトルートディレクトリへ展開してください。

ディレクトリの用意ができたら下記のコマンドを入力してください。

```shell
npm install
```

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
└── package.json

```

## 作業の進め方

### Pug

##### _settings.pug の編集

app/inc/_settings.pug ファイルの値を変更することで、
自動的に変数に値がセットされ、HTMLにコンパイル時に反映されます。

```pug
    //- サイトの設定
    -
      config = {
    
        // サイト情報
        site: {
          title: "サイト名",
          description: "説明文",
          keywords: "キーワード",
          viewport: "width=device-width,initial-scale=1",
          favicon: "",
          "apple-touch-icon": "",
          ogp: {
            locale: "ja",
            type: "type",
            title: "title",
            description: "description",
            url: "",
            site_name: "",
            image: ""
          },
        },
    
        // ページ情報
        pages: {
          'top': {
            name: "top",
            title: "ホーム",
            description: "",
          },
          'about': {
            name: "about",
            title: "私たちについて",
            description: "",
          },
          'service': {
            name: "service",
            title: "サービス紹介",
            description: "",
          },
          'works': {
            name: "works",
            title: "実績紹介",
            description: "",
          },
          'contact': {
            name: "contact",
            title: "お問合せ",
            description: "",
          },
    
        },
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

