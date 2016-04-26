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
        columns: 3,
        selector: ".js-heightline",
        property: "minHeight", // or min-height
        mobile: true,
        responsive: {
            "640": {
                columns: 2
            }
        }
    }

    var Heightline = function (options) {
        this.options = $.extend(defaultOptions, options);
        return this;
    };

    /**
     * 初期化
     */
    Heightline.prototype.init = function () {

        // ターゲットとなる要素をセットする

        this.elements = document.querySelectorAll(this.options.selector);

        // 最大の高さを格納
        this.maxHeight = 0;

        this.currentColumns = 0;

        this.setResposiveOption();

        if (this.options.mobile === false && GApp.Utils.isMobile()) {
            return false;
        }

        this.run();
    }

    /**
     * レスポンシブの設定
     */
    Heightline.prototype.setResposiveOption = function () {
        if (this.options.responsive) {
            for (var width in this.options.responsive) {
                if (screen.width < width) {
                    this.options = $.extend(this.options.responsive[width], this.options);
                }
            }
        }
    }

    /**
     * 実行する
     */
    Heightline.prototype.run = function () {

        var tempElements = [];

        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            if (this.maxHeight < element.clientHeight) {
                this.maxHeight = element.clientHeight;
            }
            element.originalHeight = element.clientHeight;
            tempElements.push(element);
            this.currentColumns++;

            // カラムを判定し、最後のカラムだったら実行する
            if (this.options.columns && ( this.currentColumns % this.options.columns === 0 || i + 1 === this.elements.length )) {
                for (var it = 0; it < tempElements.length; it++) {
                    tempElements[it].style[this.options.property] = this.maxHeight + "px";
                }
                this.maxHeight = 0;
                tempElements = [];
            }
        }

        // カラムが指定されていない時
        if (typeof this.options.columns === "undefined" || !this.options.columns) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].style[this.options.properity] = this.maxHeight + "px";
            }
        }

    }

    /**
     * リセット
     */
    Heightline.prototype.reset = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style[this.options.property] = this.elements[i].originalHeight + "px";
        }
    }

    /**
     * jQueryプラグインとして利用できるように
     * @param  {object} options
     * @return {object}
     */
    $.fn.heightline = function(options){
        var options = options || {};
        options.selector = this.selector;
        var heightline = new Heightline(options);
        heightline.init();
        return this;
    };

    $(function () {
        GApp.Heightline = Heightline;
        var heightline = new Heightline();

        heightline.init();
    });

})(jQuery);
