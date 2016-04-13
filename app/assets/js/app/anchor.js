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
     * デフォルトオプション
     * @type {{}}
     */
    var defaultOptions = {
        selector: '.js-anchor',
        dataSelector: "anchor-target",
        scrollSpeed: 500,
        easing: "linear",
    }

    var Anchor = function (options) {
        // オプションをセット
        this.options = $.extend(defaultOptions, options);
    };

    /**
     * 初期化
     * @param e ターゲットとなるエレメント
     */
    Anchor.prototype.init = function () {


        // ターゲットをセット
        this.target = $(this.options.selector);

        // クリック時の動作
        this.onClick();

    }

    /**
     * クリック時のイベント
     */
    Anchor.prototype.onClick = function () {

        var self = this;

        this.target.on('click', function (e) {
            e.preventDefault();

            // スクロール先のターゲットを指定
            var anchorTargetSelector = $(this).data(self.options.dataSelector);


            if ( typeof anchorTargetSelector === "undefined") {
                var href = $(this).attr("href");
                var anchorTargetSelector = href.match(/#(\S*)/g);
                if (typeof anchorTargetSelector[0] === "undefined") {
                    throw new Error("ターゲットとなる要素を取得できませんでした。");
                    return false;
                }
                anchorTargetSelector = anchorTargetSelector[0];
            }

            var anchorTarget = $(anchorTargetSelector);

            if ( anchorTarget.length === 0 ){
                throw new Error("ターゲットとなる要素を取得できませんでした。");
                return false;
            }
            var top = anchorTarget.offset().top;

            // スクロールさせる
            $('body,html').animate({
                scrollTop: top,
            }, {
                duration: self.options.scrollSpeed,
                easing: self.options.easing
            })
        });
    }


    $(function () {

        GApp.Anchor = new Anchor();
        GApp.Anchor.init();

    });

})(jQuery);
