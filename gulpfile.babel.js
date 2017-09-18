/**
 *  Grow Template
 *  Copyright 2017 GrowGroup Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

/**
 * =================================
 * # モジュールの読み込み
 * =================================
 */
import gulp from 'gulp'
import runSequence from 'run-sequence'
import browserSync from 'browser-sync'
import fs from 'fs'
import buffer from 'vinyl-buffer'
import stream from 'vinyl-source-stream'
import browserify from 'browserify'
import babelify from 'babelify'
import del from 'del'
import styleguide from "sc5-styleguide"
import gulpLoadPlugins from 'gulp-load-plugins'

/**
 * =================================
 * # 定数の定義
 * =================================
 */

// gulp-**** と名のつくパッケージは $.****で呼び出せるように
const $ = gulpLoadPlugins();

// BrowserSync
const BS = browserSync.create();

// BrowserSync.reload のエイリアス
const RELOAD = BS.reload;

// Sass or Scss
const SASS_EXTENSION = "scss";

/**
 * =================================
 * # 設定
 * =================================
 */

const APPPATH = "app";
const DISTPATH = "dist";

// スタイルガイドのアウトプット先
const SG5OUTPUTPATH = "styleguides";

var config = {};

/**
 * 設定 - Browser Sync
 */
config.browserSync = {
  notify: false,
  open: true,
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false
  },
  tunnel: false,
  // proxy: "http://change-to-develop-url.dev",
  server: [DISTPATH],
  ui: false,
  scrollRestoreTechnique: "cookie"
}

/**
 * 設定 - Sass
 */
config.sass = {
  src: APPPATH + "/assets/" + SASS_EXTENSION + "/*." + SASS_EXTENSION,
  dist: DISTPATH + "/assets/css/",
}

/**
 * 設定 - JavaScript
 */
config.js = {
  src: [
    APPPATH + "/assets/js/scripts.js",
    "!" + APPPATH + "/assets/js/app/*.js",
  ],
  dist: DISTPATH + "/assets/js/",
}

/**
 * 設定 - Babel
 */
config.babel = {
  src: APPPATH + "/assets/es6/index.es6",
  dist: DISTPATH + "/assets/js/",
}

/**
 * 設定 - Jade
 */
config.pug = {
  src: [APPPATH + '/*.pug', APPPATH + '/**/*.pug'],
  dist: DISTPATH + "/",
  settingsFilePath: "./pug-settings.json",
}

/**
 * 設定 - Images
 */
config.images = {
  src: APPPATH + "/assets/images/**/*",
  dist: DISTPATH + "/assets/images/",
}

/**
 * 設定 - WordPress
 */
config.wp = {
  // テーマ名
  "Name": "grow-html-template",
  // テーマのURI
  "Uri": "http://github.com/growgroup/grow-html-template",
  // 著者
  "Author": "growgroup",
  // 著者URL
  "AuthorUri": "http://grow-group.jp",
  // 説明文
  "Description": "HTML Boilerplate",
  // バージョン
  "Version": "1.0.0",
  // ライセンス
  "License": "GPL v3 or Later",
  // ライセンスの詳細が記載されているURI
  "LicenseUri": "",
  // 親テーマ名
  "Template": "growp",
  // タグ
  "Tag": "",
  // テキストドメイン
  "TextDomain": "grow-html-template",
  // その他
  "Option": "",
}

var wpThemeInfo = '@charset "UTF-8";\n'
  + '/*\n'
  + ' Theme Name: ' + config.wp.Name + '\n'
  + ' Theme URI: ' + config.wp.Uri + '\n'
  + ' Author: ' + config.wp.Author + '\n'
  + ' Author URI: ' + config.wp.AuthorUri + '\n'
  + ' Description: ' + config.wp.Description + '\n'
  + ' Version: ' + config.wp.Version + '\n'
  + ' Theme License: ' + config.wp.License + '\n'
  + ' License URI: ' + config.wp.LicenseUri + '\n'
  + ' Template: ' + config.wp.Template + '\n'
  + ' Tags: ' + config.wp.Tag + '\n'
  + ' Text Domain: ' + config.wp.TextDomain + '\n'
  + config.wp.Option
  + '*/\n';


/**
 * =================================
 * # Sass
 * Sass のコンパイル
 * =================================
 */
gulp.task('styles', () => {

  // bower がインストールされているかどうかのチェック
  try {
    fs.statSync(__dirname + "/" + APPPATH + "/bower_components")
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error('\u001b[33m' + "[Error] Please run \"bower install\" " + '\u001b[0m');
      return false;
    }
    ;
  }

  return gulp.src(config.sass.src)
    .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
    .pipe($.cssGlobbing({extensions: ['.' + SASS_EXTENSION]}))
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 4,
      includePaths: ['.', 'node_modules/susy/sass']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['ie 9', 'Android 4'],
    }))
    .pipe($.size({title: 'styles'}))
    .pipe(gulp.dest(config.sass.dist))
    .pipe(BS.stream({
      match: APPPATH + "/**/*.css"
    }))
    .pipe($.notify("Styles Task Completed!"));
});

/**
 * =================================
 * # BrowserSync
 * BrowserSync の立ち上げ
 * =================================
 */
gulp.task('browserSync', () => {
  BS.init(config.browserSync)
});

/**
 * =================================
 * # Jade
 * Jade テンプレートのコンパイル
 * =================================
 */
gulp.task('pug', () => {
  return gulp.src(config.pug.src)
    .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
    .pipe($.changed(DISTPATH, {extension: '.html'}))
    .pipe($.if(global.isWatching, $.cached('pug')))
    .pipe($.pugInheritance({basedir: APPPATH, skip: 'node_modules,assets'}))
    .pipe($.filter(function (file) {
      return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    }))
    .pipe($.pug({
      pretty: true,
      cache: true,
      escapePre: true,
      basedir: APPPATH,
      filters: {
        // 改行をbrに置換
        'gt-textblock': function (text, options) {
          return text.replace(/\r?\n/g, '<br>');
        },
        // テキストを改行に合わせてリスト表示
        'gt-simple-list': function (text, options) {
          var list = text.split(/\r\n|\r|\n/)
          var listhtml = []
          for (var i = 0; i < list.length; i++) {
            listhtml.push("<li>" + list[i] + "</li>");
          }
          return listhtml.join("");
        },
      }
    }))
    .pipe(gulp.dest(config.pug.dist))
    .pipe($.size({title: 'HTML'}))
    .pipe(BS.stream())
    .pipe($.notify("Pug Task Completed!"));
});

/**
 * =================================
 * # Scripts
 * Js の concat, uglify
 * =================================
 */
gulp.task('scripts', () => {
  return gulp.src(config.js.src)
    .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
    .pipe($.sourcemaps.init())
    .pipe($.concat('scripts.js'))
    .pipe($.uglify({compress: true}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.js.dist))
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(BS.stream({
      match: APPPATH + "/**/*.js"
    }))
    .pipe($.notify("Scripts Task Completed!"));
});


/**
 * =================================
 * # Babel
 * es6 のコンパイル
 * =================================
 */
gulp.task('babel', () => {
  browserify({
    entries: [config.babel.src]
  })
    .transform(babelify)
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(stream('index.js'))
    .pipe(buffer())
    .pipe(gulp.dest(config.babel.dist))
    .pipe($.notify({message: 'Babel task complete！'}));
});


/**
 * 初期状態で読み込む js
 */
gulp.task('babel_app', () => {
  browserify({
    entries: ["./app/assets/js/app.js"]
  })
    .transform(babelify)
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(stream('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init())
    .pipe($.uglify({compress: true}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.babel.dist))
    .pipe($.notify({message: 'Babel App task complete！'}));
});


/**
 * =================================
 * # Lint
 * ESLint の動作
 * =================================
 */
gulp.task('lint', () => {
  gulp.src(config.js.src)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!BS.active, $.eslint.failOnError()))
});

/**
 * =================================
 * # Watch
 * ファイルを監視
 * =================================
 */

gulp.task('setWatch', function () {
  global.isWatching = true;
});

gulp.task('watch', ['setWatch', 'browserSync'], () => {

  gulp.watch([APPPATH + '/**/*.pug'], ['pug', BS.reload]);
  gulp.watch([APPPATH + '/bower_components/**/*'], ['copy', BS.reload]);
  gulp.watch([APPPATH + '/assets/**/*.es6'], ['babel', BS.reload]);
  gulp.watch([APPPATH + '/assets/**/*.{' + SASS_EXTENSION + ',css}'], ['styles']);
  gulp.watch([APPPATH + '/assets/js/scripts.js'], ['lint', 'scripts']);
  gulp.watch([APPPATH + '/assets/js/app/*.js', APPPATH + '/assets/js/app.js'], ['lint', 'babel_app']);
  gulp.watch([APPPATH + '/assets/images/**/*'], ['images']);

});

gulp.task('watch:styleguide', () => {
  gulp.watch([APPPATH + '/assets/**/*.{' + SASS_EXTENSION + ',css}'], ['styles', 'styleguide:applystyles', 'styleguide:generate', BS.stream()]);
})

/**
 * =================================
 * # Copy
 * dist ディレクトリへ app ディレクトリからファイルをコピー
 * =================================
 */

gulp.task('copy:app', () => {
  return gulp.src([
    APPPATH + '/**/*',
    APPPATH + '/fonts',
    '!./' + APPPATH + '/assets/{' + SASS_EXTENSION + ',' + SASS_EXTENSION + '/**}',
    '!./' + APPPATH + '/inc',
    '!./' + APPPATH + '/*.pug',
    '!./' + APPPATH + '/**/*.pug',
    '!./' + APPPATH + '/assets/js/app.js',
    '!./' + APPPATH + '/assets/js/app/*.js',
  ], {
    dot: true,
    base: "app"
  })
    .pipe(gulp.dest(DISTPATH))
    .pipe($.size({title: 'copy'}));
});

gulp.task('copy', ['copy:app']);

/**
 * =================================
 * # Clean
 * dist ディレクトリ内をすべて削除
 * =================================
 */
gulp.task('clean', cb => del([DISTPATH + '/*', '!' + DISTPATH + '/.git'], {dot: true}));

/**
 * =================================
 * # Images
 * 画像の最適化
 * =================================
 */

gulp.task('images', () =>
  gulp.src(config.images.src)
    .pipe($.plumber())
    .pipe($.cached($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(config.images.dist))
    .pipe($.notify({message: 'Images task complete!'}))
    .pipe($.size({title: 'images'}))
);


/**
 * =================================
 * # Style Guide
 * ./styleguides/ 配下にスタイルガイドを出力
 * =================================
 */

gulp.task('styleguide:generate', () => {
  return gulp.src([APPPATH + '/assets/' + SASS_EXTENSION + '/*.' + SASS_EXTENSION, APPPATH + '/assets/' + SASS_EXTENSION + '/**/*.' + SASS_EXTENSION])
    .pipe(styleguide.generate({
      title: 'Grow Template',
      server: true,
      port: 8888,
      rootPath: "./" + SG5OUTPUTPATH,
      overviewPath: "./" + 'README.md',
      extraHead: [
        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>',
        '<script src="/assets/js/vendor.js"></script>',
        '<script src="/assets/js/app.js"></script>',

      ]
    }))
    .pipe(gulp.dest(SG5OUTPUTPATH));
});

gulp.task('styleguide:applystyles', () => {

  return gulp.src(APPPATH + '/assets/' + SASS_EXTENSION + '/style.' + SASS_EXTENSION)
    .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
    .pipe($.cssGlobbing({extensions: ['.css', '.' + SASS_EXTENSION]}))
    .pipe($.sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(SG5OUTPUTPATH));
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles', 'watch:styleguide']);

/**
 * =================================
 * # WP
 * WordPress テーマの準備
 * =================================
 */

function makeWordPressFile() {
  if (wpThemeInfo) {
    fs.writeFile(DISTPATH + '/style.css', wpThemeInfo, (err) => {
      if (err) throw err;
    });
    fs.writeFile(DISTPATH + '/index.php', "", (err) => {
      if (err) throw err;
    });
    fs.writeFile(DISTPATH + '/functions.php', "", (err) => {
      if (err) throw err;
    });
  }
}

gulp.task('wp', function () {
  makeWordPressFile();
});

/**
 * =================================
 * gulp コマンドで呼び出されるデフォルトのタスク
 * =================================
 */
gulp.task('default', ['clean'], cb => {
  runSequence(
    'styles',
    ['lint', 'pug', 'scripts', 'copy', 'babel', 'babel_app'],
    'watch',
    'images',
    'wp',
    cb
  )
});

/**
 * =================================
 * # Build
 * gulp コマンドで呼び出されるデフォルトのタスク
 * =================================
 */
gulp.task('build', ['clean'], cb => {
  runSequence(
    'styles',
    ['lint', 'pug', 'scripts', 'copy', 'babel', 'images', 'babel_app'],
    cb
  )
});
