/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */
(function ($) {
    "use strict";

    if (typeof window.GApp === "undefined") {
        window.GApp = {};
    }

    var GApp = window.GApp || {};

    var defaultOptions = {
        selector: '.js-fixedheader', // 実行するセレクタ
        offset: 500, // 実行するオフセットピクセル数,
        cssClass: ".l-global-navigation", // CSSが定義されているクラス
        activeClass: "is-fixed", // 有効な時に付与するクラス
        mobile: false // モバイル時にどう動作するか
    }

    /**
     * コンストラクター
     * @param options
     * @constructor
     */
    var Fixedheader = function (options) {
        this.options = $.extend(defaultOptions, options);

    }

    /**
     * 初期化する
     */
    Fixedheader.prototype.init = function () {
        this.target = $(this.options.selector);

        Fixedheader.prototype.isFixed = Fixedheader.prototype.isFixed.bind(this);
        Fixedheader.prototype.run = Fixedheader.prototype.run.bind(this);
        if (
            ( screen.width > 768 && this.options.mobile )
            || this.options.mobile === false
        ) {
            window.requestAnimationFrame(this.run);
        }
    }


    /**
     * 実行
     */
    Fixedheader.prototype.run = function () {
        if (this.isFixed()) {
            this.target.addClass(this.options.activeClass);
        } else {
            this.target.removeClass(this.options.activeClass);
        }

        window.requestAnimationFrame(this.run);
    }

    /**
     * 判断する
     * @returns {boolean}
     */
    Fixedheader.prototype.isFixed = function () {
        
        // オフセットより高いか判断する
        return ( window.pageYOffset > this.options.offset ) ? true : false;
    }


    $(function () {

        GApp.Fixedheader = new Fixedheader();
        GApp.Fixedheader.init();
    })


})(jQuery);
