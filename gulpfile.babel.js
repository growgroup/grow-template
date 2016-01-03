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

import gulp from 'gulp';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import browserify from 'browserify';
import babelify from 'babelify';
import mainBowerFiles from 'main-bower-files';
import {stream as wiredep} from 'wiredep';
import del from 'del';
import styleguide from "sc5-styleguide";
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';
import jadeSettingFile from './jade-settings.json';

/**
 * =================================
 * # 定数の定義
 * =================================
 */

// gulp-**** と名のつくパッケージは $.****で呼び出せるように
const $ = gulpLoadPlugins();

// browserSync.reload のエイリアス
const reload = browserSync.reload;

// bower メインファイルの配列
const bowerFiles = mainBowerFiles();

/**
 * =================================
 * # 設定
 * =================================
 */

var appPath = "app";
var distPath = "dist";

// スタイルガイドのアウトプット先
var sg5OutputPath = "styleguides";

var config = {};

/**
 * 設定 - Browser Sync
 */
config.browserSync = {
    notify: true,
    open: true,
    ghostMode: {
        clicks: true,
        forms: true,
        scroll: false
    },
    tunnel: false,
    server: ['dist', 'app'],
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
        appPath + "/assets/js/*.js",
    /** 他に追加したいファイルがある場合は追記 **/
        // appPath + "/assets/js/example.js"
    ],
    dist: distPath + "/assets/js/",
}


/**
 * 設定 - Jade
 */
config.jade = {
    src: appPath + "/*.jade",
    dist: distPath + "/",
    settingsFilePath: "./jade-settings.json",
}


/**
 * =================================
 * # Sass
 * Sass のコンパイル
 * =================================
 */
gulp.task('styles', () => {
    return gulp.src(config.sass.src)
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe($.cssGlobbing({extensions: ['.css', '.scss']}))
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
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
gulp.task('jade', () => {
    return gulp.src(config.jade.src)
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe($.data(function (file) {
            return jadeSettingFile;
        }))
        .pipe($.jade({pretty: true, escapePre: true}))
        .pipe(gulp.dest(config.jade.dist))
        .pipe($.size({title: 'HTML'}))
        .pipe(reload({stream: true}))
        .pipe($.notify("Jade Task Completed!"));
});

/**
 * =================================
 * # HTML
 * useref で HTMLファイルを監視
 * =================================
 */
gulp.task('html', ()=> {
    return gulp.src(distPath + "/**/*.html")
        .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
        .pipe(gulp.dest(distPath));
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
        .pipe($.babel())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.js.dist))
        .pipe($.concat('main.min.js'))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.size({title: 'scripts'}))
        .pipe($.sourcemaps.write('.'))
        .pipe(reload({stream: true}))
        .pipe($.notify("Scripts Task Completed!"));
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
gulp.task('watch', ['browserSync'], ()=> {

    gulp.watch([appPath + '/**/**/*.jade'], ['jade', reload]);
    gulp.watch([appPath + '/assets/**/*.{scss,css}'], ['styles', 'styleguide', reload]);
    gulp.watch([appPath + '/assets/js/**/*.js'], ['lint', 'scripts']);
    gulp.watch([appPath + '/assets/images/**/*'], reload);
    gulp.watch([distPath + '/**/*.html'], ['html', reload]);
    gulp.watch('bower.json', ['wiredep']);
});

/**
 * =================================
 * # Copy
 * dist ディレクトリへ app ディレクトリからファイルをコピー
 * =================================
 */
gulp.task('copy', () =>
    gulp.src([
            'app/*',
            '!app/inc',
            '!app/*.jade',
        ], {
            dot: true
        })
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'copy'}))
);

/**
 * =================================
 * # Clean
 * dist ディレクトリ内をすべて削除
 * =================================
 */
gulp.task('clean', cb => del(['dist/*', '!dist/.git'], {dot: true}));

/**
 * =================================
 * # Wiredep
 * bower で追加、削除したパッケージを jade テンプレートに反映
 * =================================
 */
gulp.task('wiredep', () => {
    gulp.src('app/**/*.jade')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest(appPath));
});


/**
 * =================================
 * # Style Guide
 * ./styleguides/ 配下にスタイルガイドを出力
 * =================================
 */

gulp.task('styleguide:generate', () => {
    return gulp.src(appPath + "/assets/scss/**/*.scss")
        .pipe(styleguide.generate({
            title: 'Styleguide',
            server: true,
            rootPath: sg5OutputPath,
            overviewPath: 'README.md'
        }))
        .pipe(gulp.dest(sg5OutputPath));
});

gulp.task('styleguide:serve', () => {
    browserSync({
        notify: true,
        open: true,
        port: 3003,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
        },
        tunnel: false,
        server: ['./styleguides'],
    })
});

gulp.task('styleguide', ['styleguide:generate','styleguide:serve']);

/**
 * =================================
 * # Default
 * gulp コマンドで呼び出されるデフォルトのタスク
 * =================================
 */
gulp.task('default', ['clean'], cb => {
    runSequence(
        'styles',
        ['lint', 'jade', 'scripts', 'copy'],
        'html',
        'watch',
        cb
    )
});
