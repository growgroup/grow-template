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


import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';
import jadeSettingFile from './jade-settings.json';

/**
 * =================================
 * # 定数の定義
 * =================================
 */
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const bowerFiles = mainBowerFiles();

/**
 * =================================
 * # 設定
 * =================================
 */
var appPath = "app";
var distPath = "dist";


var config = {};

/**
 * Browser Sync 設定
 * @type {{notify: boolean, open: boolean, ghostMode: {clicks: boolean, forms: boolean, scroll: boolean}, tunnel: boolean}}
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
 * Sass 設定
 * @type {{}}
 */
config.sass = {
    src: appPath + "/assets/scss/*.scss",
    dist: distPath + "/assets/css/",
}

/**
 * JavaScript 設定
 * @type {{}}
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
 * Jade 設定
 * @type {{}}
 */
config.jade = {
    src: appPath + "/*.jade",
    dist: distPath + "/",
    settingsFilePath: "./jade-settings.json",
}


/**
 * =================================
 * # Sass
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
 * =================================
 */
gulp.task('browserSync', () => {
    browserSync(config.browserSync)
});

/**
 * =================================
 * # Jade
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
 * =================================
 */
gulp.task('html', ()=>{
    return gulp.src(distPath + "/**/*.html")
        .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
        .pipe(gulp.dest(distPath));
});

/**
 * =================================
 * # Jade
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
 * =================================
 */
gulp.task('watch', ['browserSync'], ()=> {

    gulp.watch([appPath + '/**/**/*.jade'], ['jade', reload]);
    gulp.watch([appPath + '/assets/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch([appPath + '/assets/js/**/*.js'], ['lint', 'scripts']);
    gulp.watch([appPath + '/assets/images/**/*'], reload);
    gulp.watch([distPath + '/**/*.html'], ['html', reload]);
    gulp.watch('bower.json', ['wiredep']);
});

/**
 * =================================
 * # Copy
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
 * =================================
 */
gulp.task('clean', cb => del(['dist/*', '!dist/.git'], {dot: true}));

gulp.task('wiredep', () => {
    gulp.src('app/**/*.jade')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest(appPath));
});


/**
 * =================================
 * # Default
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
