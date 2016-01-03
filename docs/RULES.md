# コーディング規約について

## 1. HTML

##### HTML5 で構築する
特に指定がない場合、HTML5でコーディングを行う。



##### 大文字を利用しない

タグ、属性ともに小文字で記述すること。

```html
<!-- Bad -->
<a HREF="#"></a>
```

```html
<!-- Good -->
<a href="#"></a>
```

##### ID 属性についてはスタイル目的として利用しない
ID 属性は JavaScript で利用する時のみ付与する

```html
<!-- Bad -->
<a href="" id="button-primary"></a>
```

```html
<!-- Good -->
<a href="" class="button-primary"></a>
```

##### img タグには alt 属性を必ず記述する
Alt 属性に適切な値がない場合は、空状態で記述すること。
```html
<!-- Bad -->
<img src="/hoge.png">
```

```html
<!-- Good -->
<img src="/hoge.png" alt="">
```

##### インデントはスペースを2つで表現する
インデントはスペース2つで表現する
```html
<!-- Bad -->
<div>
    <a href="#">hoge</a>
</div>
```

```html
<!-- Good -->
<div>
  <a href="#">hoge</a>
</div>
```

##### HTML引用符
属性値の引用符は、ダブルクオーテーション(")を使用する。
```html
<!-- Bad -->
<a class='maia-button maia-button-secondary'>Sign in</a>
```

```html
<!-- Good -->
<a class="maia-button maia-button-secondary">Sign in</a>
```

##### 関係の分離

HTML(構造)とCSS(見た目)とScript(振る舞い)は独立させて、3つの相互関係はなるべく最小限にする。  
ドキュメントやテンプレートにはHTMLだけを含むようにし、HTMLには構造だけを表現するようにする。   
見た目に関するあらゆる内容はCSSへ、振る舞いに関してはScriptへ記述する。  
HTMLからCSSやScriptへのリンクはなるべく減らし（まとめて）、互いのファイル間の接触部分をなるべく少なくする。  
メンテナンス面を考慮すれば、構造、見た目、振る舞いの分離は重要。CSSやScriptの更新よりも、HTMLドキュメントやテンプレートの修正コストのほうが常に大きい。  
```html
<!-- Bad -->
<!DOCTYPE html>
<title>HTML sucks</title>
<link rel="stylesheet" href="base.css" media="screen">
<link rel="stylesheet" href="grid.css" media="screen">
<link rel="stylesheet" href="print.css" media="print">
<h1 style="font-size: 1em;">HTML sucks</h1>
<p>I’ve read about this on a few sites but now I’m sure:
  <u>HTML is stupid!!1</u>
<center>I can’t believe there’s no way to control the styling of
  my website without doing everything all over again!</center>
```

```html
<!-- Good -->
<!DOCTYPE html>
<title>My first CSS-only redesign</title>
<link rel="stylesheet" href="default.css">
<h1>My first CSS-only redesign</h1>
<p>I’ve read about this on a few sites but today I’m actually
  doing it: separating concerns and avoiding anything in the HTML of
  my website that is presentational.
<p>It’s awesome!
```

##### 実体参照

UTF-8において、&mdash;, &rdquo;, or &#x263a;などの実体参照を使用する必要はない。  
例外としてHTMLで特別な意味を持つ"<"や"&"には使用する。  

```html
<!-- Bad -->
The currency symbol for the Euro is &ldquo;&eur;&rdquo;.
```

```html
<!-- Good -->
The currency symbol for the Euro is “€”.
```
