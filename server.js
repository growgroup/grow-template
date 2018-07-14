var pugConfig = require("./build/pug.js")
var pug = require("pug")
var browserSync = require("browser-sync")
var url = require("url")
var path = require("path")
var fs = require("fs")

const bs = browserSync.create();
const APPPATH = __dirname + "/app"
const DISTPATH = __dirname + "/dist"

function fileExists(file) {
  try {
    fs.statSync(file);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
  }
}

/**
 * browserSync ミドルウェア
 * pugのコンパイルを動的に対応
 */
function pugMiddleWare(req, res, next) {
  const requestPath = url.parse(req.url).pathname;
  // .html or / で終わるリクエストだけを対象とする
  if (!requestPath.match(/(\/|\.html)$/)) {
    return next();
  }

  // HTMLファイルが存在すれば、HTMLを返す
  var htmlPath = path.parse(requestPath).ext == '' ? `${requestPath}index.html` : requestPath;

  // pug のファイルパスに変換
  var pugPath = path.join(APPPATH, htmlPath.replace('.html', '.pug'));
  // pugファイルがなければ404を返す
  if (!fileExists(pugPath)) {
    return next();
  }

  // pugがファイルを見つけたのでコンパイルする
  var content = pug.renderFile(pugPath, pugConfig);
  res.setHeader('Content-Type', 'text/html');
  // コンパイル結果をレスポンスに渡す
  res.end(new Buffer(content));
  // next();
}

var config = {
  notify: true,
  open: true,
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false
  },
  tunnel: false,
  // proxy: "http://change-to-develop-url.dev",
  server: {
    baseDir: [DISTPATH],
    directory: false,
    middleware: [
      pugMiddleWare
    ]
  },
  scrollRestoreTechnique: 'cookie'
}
bs.watch("dist/**/*.html").on("change", function(event) {
  bs.reload("*.html")
});
bs.watch("dist/assets/**/*.css").on("change", function(event) {
  bs.reload("*.css")
});
bs.watch("dist/assets/**/*.js").on("change", function() {
  bs.reload("*.js")
});

bs.init(config)
