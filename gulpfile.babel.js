/**
 *  Grow Template
 *  Copyright 2015 GrowGroup Inc. All rights reserved.
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
import debug from 'gulp-debug';
/**
 * =================================
 * # 定数の定義
 * =================================
 */

// gulp-**** と名のつくパッケージは $.****で呼び出せるように
const $ = gulpLoadPlugins();

// browserSync.reload のエイリアス
const reload = browserSync.reload;


/**
 * =================================
 * # 設定
 * =================================
 */

const appPath = "app";
const distPath = "dist";

// スタイルガイドのアウトプット先
const sg5OutputPath = "styleguides";

var config = {};

/**
 * 設定 - Browser Sync
 */
config.browserSync = {
    notify: false,
    open: true,
    ghostMode: {
        clicks: false,
        forms: true,
        scroll: false
    },
    tunnel: false,
    server: [distPath],
    ui: false,
}

/**
 * 設定 - Sass
 */
config.sass = {
    src: appPath + "/assets/scss/*.scss",
    dist: distPath + "/assets/css/",
}

/**
 * 設定 - JavaScript
 */
config.js = {
    src: [
        appPath + "/assets/js/scripts.js",
        "!" + appPath + "/assets/js/app/*.js",
    ],
    dist: distPath + "/assets/js/",
}

/**
 * 設定 - Babel
 */
config.babel = {
    src: appPath + "/assets/es6/index.es6",
    dist: distPath + "/assets/js/",
}

/**
 * 設定 - Jade
 */
config.pug = {
    src: [appPath + '/*.pug', appPath + '/**/*.pug'],
    dist: distPath + "/",
    settingsFilePath: "./pug-settings.json",
}

/**
 * 設定 - Images
 */
config.images = {
    src: appPath + "/assets/images/**/*",
    dist: distPath + "/assets/images/",
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
        fs.statSync(__dirname + "/" + appPath + "/bower_components")
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error('\u001b[33m' + "[Error] Please run \"bower install\" " + '\u001b[0m');
            return false;
        }
        ;
    }

    return gulp.src(config.sass.src)
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe($.cssGlobbing({extensions: ['.scss']}))
        // .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 4,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.size({title: 'styles'}))
        .pipe(gulp.dest(config.sass.dist))
        .pipe(reload({stream: true}))
        .pipe($.notify("Styles Task Completed!"));
});

/**
 * =================================
 * # BrowserSync
 * BrowserSync の立ち上げ
 * =================================
 */
gulp.task('browserSync', () => {
    browserSync(config.browserSync)
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
        .pipe($.changed(distPath, {extension: '.html'}))
        .pipe($.if(global.isWatching, $.cached('pug')))
        .pipe($.pugInheritance({basedir: appPath, skip: 'node_modules'}))
        .pipe($.filter(function (file) {
            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
        }))
        .pipe($.pug({
            pretty: true,
            cache: true,
            escapePre: true,
            basedir: appPath,
        }))
        .pipe(gulp.dest(config.pug.dist))
        .pipe($.size({title: 'HTML'}))
        .pipe(reload({stream: true}))
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
        .pipe(reload({stream: true}))
        .pipe($.notify("Scripts Task Completed!"));
});


/**
 * =================================
 * # Babel
 * es6 のコンパイル
 * =================================
 */
gulp.task('babel', ()=> {
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
 * アプリケーション
 * @param  {[type]} err) {                   console.log("Error : " + err.message);    })    .pipe(stream('app.js'))    .pipe(buffer())    .pipe(gulp.dest(config.babel.dist))    .pipe($.notify({message: 'Babel App task complete！'}));} [description]
 * @return {[type]}      [description]
 */
gulp.task('babel_app', ()=> {
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
        .pipe($.if(!browserSync.active, $.eslint.failOnError()))
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

gulp.task('watch', ['setWatch', 'browserSync'], ()=> {

    gulp.watch([appPath + '/**/*.pug'], ['pug', reload]);
    gulp.watch([appPath + '/bower_components/**/*'], ['copy', reload]);
    gulp.watch([appPath + '/assets/**/*.es6'], ['babel', reload]);
    gulp.watch([appPath + '/assets/**/*.{scss,css}'], ['styles']);
    gulp.watch([appPath + '/assets/js/**/*.js'], ['lint', 'scripts']);
    gulp.watch([appPath + '/assets/js/app/*.js', appPath + '/assets/js/app.js'], ['lint', 'babel_app']);
    gulp.watch([appPath + '/assets/images/**/*'], ['images']);

});

gulp.task('watch:styleguide', ()=> {
    gulp.watch([appPath + '/assets/**/*.{scss,css}'], ['styles', 'styleguide:applystyles', 'styleguide:generate', reload]);
})

/**
 * =================================
 * # Copy
 * dist ディレクトリへ app ディレクトリからファイルをコピー
 * =================================
 */

gulp.task('copy:app', () => {
    return gulp.src([
        appPath + '/**/*',
        appPath + '/fonts',
        '!./' + appPath + '/assets/{scss,scss/**}',
        '!./' + appPath + '/inc',
        '!./' + appPath + '/*.pug',
        '!./' + appPath + '/**/*.pug',
        '!./' + appPath + '/assets/js/app.js',
        '!./' + appPath + '/assets/js/app/*.js',
    ], {
        dot: true,
        base: "app"
    })
        .pipe(gulp.dest(distPath))
        .pipe($.size({title: 'copy'}));
});

gulp.task('copy', ['copy:app']);

/**
 * =================================
 * # Clean
 * dist ディレクトリ内をすべて削除
 * =================================
 */
gulp.task('clean', cb => del([distPath + '/*', '!' + distPath + '/.git'], {dot: true}));

/**
 * =================================
 * # Images
 * 画像の最適化
 * =================================
 */

gulp.task('images', () =>
    gulp.src(config.images.src)
        .pipe($.plumber())
        .pipe($.cached($.imagemin({optimizationLevel: 8, progressive: true, interlaced: true})))
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
    return gulp.src([appPath + "/assets/scss/*.scss", appPath + "/assets/scss/**/*.scss"])
        .pipe(styleguide.generate({
            title: 'Grow Template',
            server: true,
            port: 8888,
            rootPath: "./" + sg5OutputPath,
            overviewPath: "./" + 'README.md',
            extraHead: [
                '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>',
                '<script src="/assets/js/vendor.js"></script>',
                '<script src="/assets/js/app.js"></script>',

            ]
        }))
        .pipe(gulp.dest(sg5OutputPath));
});

gulp.task('styleguide:applystyles', () => {

    return gulp.src(appPath + "/assets/scss/style.scss")
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe($.cssGlobbing({extensions: ['.css', '.scss']}))
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe(styleguide.applyStyles())
        .pipe(gulp.dest(sg5OutputPath));
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
        fs.writeFile(distPath + '/style.css', wpThemeInfo);
        fs.writeFile(distPath + '/index.php', "");
        fs.writeFile(distPath + '/functions.php', "");
    }
}

gulp.task('wp', function () {
    makeWordPressFile();
});

/**
 * =================================
 * # DefaultÛ<65;122;28M
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
