/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 * <div class="c-panel js-accordion">
 *     <div class="c-panel__title" data-accordion-title>
 *         Title
 *     </div>
 *     <div class="c-panel__content" data-accordion-content>
 *         Content
 *     </div>
 * </div>
 *
 */
(function ($) {
    "use strict";

    if (typeof window.GApp === "undefined") {
        window.GApp = {};
    }

    var GApp = window.GApp || {};


    var defaultOptions = {
        selector: ".js-accordion",
        titleTargetAttr: "data-accordion-title",
        contentTargetAttr: "data-accordion-content",
        speed: 300,
        defaultOpen: false
    }

    /**
     * コンストラクター
     * @constructor
     */
    var Accordion = function (options) {
        this.options = $.extend(defaultOptions, options);
    }

    /**
     * 初期化
     */
    Accordion.prototype.init = function () {

        // ターゲットを取得する
        this.targetAll = $(this.options.selector);

        // ターゲットが存在しない場合は実行しない
        if (!this.targetAll.length) {
            return false;
        }
        // 実行する
        this.run();
    }

    /**
     * 実行する
     */
    Accordion.prototype.run = function () {
        for (var i = 0; i < this.targetAll.length; i++) {
            var target = $(this.targetAll[i]);
            target.title = target.find('*[' + this.options.titleTargetAttr + ']');
            target.content = target.find('*[' + this.options.contentTargetAttr + ']');
            this.accordion(target);
            if (this.options.defaultOpen) {
                target.content.slideDown();
            }
        }
    }

    /**
     * アコーディオンの動作
     * @param el
     */
    Accordion.prototype.accordion = function (el) {
        // クリック時の動作
        var self = this;
        $(el.title).on('click', function (e) {
            e.preventDefault();
            el.content.slideToggle(self.options.speed);
        });

        $(el.title).on('mouseover', function (e) {
            $(this).css('cursor', 'pointer');
        });
    }

    $(function () {
        GApp.Accordion = new Accordion();
        GApp.Accordion.init();
    });


})(jQuery);
