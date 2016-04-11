/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */
(function ($) {
    'use strict';

    if (typeof window.GApp === "undefined") {
        window.GApp = {};
    }

    var GApp = window.GApp || {};

    /**
     * 初期オプション
     * @type {{selector: string, dataEffectSelector: string}}
     */
    var defaultOptions = {
        selector: ".js-parallax",

        dataEffectSelector: "parallax-effect",

        offset: 300,

        // 透過アニメーションの係数
        opacityProp: 0,

        // 縦方向の係数
        translateYProp: 100,
    }

    /**
     * コンストラクター
     * @param options
     * @constructor
     */
    var Parallax = function (options) {

        // オプションをセット
        this.options = $.extend(defaultOptions, options);
    }


    /**
     * 初期化する
     * @returns {boolean}
     */
    Parallax.prototype.init = function () {

        this.targetAll = document.querySelectorAll(this.options.selector);

        if (typeof this.targetAll === "undefined") {
            return false;
        }

        this.setProp();
        this.run();
    }

    /**
     * 設定をセットする
     */
    Parallax.prototype.setProp = function () {
        for (var i = 0; i < this.targetAll.length; i++) {

            // スタートする位置
            var rect = this.targetAll[i].getBoundingClientRect();
            this.targetAll[i].startPosition = rect.top + document.body.scrollTop;

            // 動作が完了するまでのpixel数

            this.targetAll[i].endPosition = parseInt(( this.targetAll[i].getAttribute("data-parallax-end") ) ? this.targetAll[i].getAttribute("data-parallax-end") : 300);

            // 発動する位置までのオフセット
            this.targetAll[i].offset = this.targetAll[i].getAttribute("data-parallax-start-offset");

            if (GApp.Utils.isEmpty(this.targetAll[i].offset === "undefined")) {
                this.targetAll[i].offset = 500;
            }
            // 初期値
            this.targetAll[i].defaultProp = JSON.parse(this.targetAll[i].getAttribute("data-parallax-defaultprop"));

            // 終了時のプロパティ
            this.targetAll[i].endProp = JSON.parse(this.targetAll[i].getAttribute("data-parallax-endprop"));
            
            for (var key in this.targetAll[i].defaultProp) {
                this.targetAll[i].style[key] = this.targetAll[i].defaultProp[key];
            }
        }
    }

    var flag = 0;
    /**
     * アニメーションを実行
     */
    Parallax.prototype.animate = function () {

        var windowY = window.pageYOffset;

        for (var i = 0; i < this.targetAll.length; i++) {
            var elem = this.targetAll[i];
            var startPosition = parseInt(elem.startPosition - elem.offset);
            var endPosition = parseInt(elem.startPosition + elem.endPosition);
            var scrollPositionDiff = endPosition - windowY;
            var positionDiff = parseInt(endPosition - startPosition);
            var scrollEndPositionDiff = positionDiff - scrollPositionDiff;
            var defaultProp = elem.defaultProp;
            var endProp = elem.endProp;
            var keisuu = scrollEndPositionDiff / positionDiff;


            // if (windowY > startPosition && windowY < endPosition) {
            for (var key in endProp) {
                var stylevalue;
                if (endProp[key] === 0) {
                    endProp[key] = 0.01;
                }

                var startvalue = defaultProp[key];
                var endvalue = endProp[key];
                var average = Math.abs(startvalue - endvalue);
                if (startvalue > endvalue) {
                    stylevalue = (endvalue * keisuu);
                } else {
                    stylevalue = (endvalue * keisuu);
                }
                elem.style[key] = stylevalue;
            }
            // }
        }

        window.requestAnimationFrame(Parallax.prototype.animate.bind(this));

    }

    /**
     * 透過を計算
     * @param startPosition
     * @param y
     * @returns {number}
     */
    Parallax.prototype.calcOpacity = function (startPosition, y) {
        return (1 - (Math.ceil(( y - startPosition) * 100) / 10000));
    }

    /**
     * 実行
     */
    Parallax.prototype.run = function () {
        window.requestAnimationFrame(Parallax.prototype.animate.bind(this));
    }


    $(function () {
        GApp.Parallax = new Parallax();

        GApp.Parallax.init();
    });


})(jQuery);
