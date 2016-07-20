/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 *
 * <div class="js-slidebar-menu">
 *    <ul>
 *        <li>menu</li>
 *        <li>menu</li>
 *        <li>menu</li>
 *    </ul>
 * </div>
 *
 * <a href="#" class="js-slidebar-button"><i class="fa fa-bars"></i></a>
 *
 * <div class="js-slidebar-container">
 *     content
 * </div>
 *
 */
(function ($) {

    "use strict";

    if (typeof window.GApp === "undefined") {
        window.GApp = {};
    }

    var GApp = window.GApp || {};

    /**
     * デフォルトオプション
     * @type {{}}
     */
    var defaultOptions = {
        containerSelector: '.js-slidebar-container',
        buttonSelector: '.js-slidebar-button',
        menuSelector: '.js-slidebar-menu',
        slideSpeed: 500
    }

    var Slidebar = function (options) {
        // オプションをセット
        this.options = $.extend(defaultOptions, options);
        // オープン
        this.isActive = false;
    };


    /**
     * 初期化
     */
    Slidebar.prototype.init = function () {

        this.menu = $(this.options.menuSelector)
        this.button = $(this.options.buttonSelector)
        this.container = $(this.options.containerSelector)

        this.trigger();
        this.bodyTrigger();
        Slidebar.prototype.toggle = Slidebar.prototype.toggle.bind(this);
        $("body").addClass('slidebar-init')
    }

    /**
     * クリック時のトリガー
     */
    Slidebar.prototype.trigger = function () {
        var self = this;
        $(document).on('click', this.options.buttonSelector, function(e){
            e.preventDefault();
            self.toggle();
        });
    }

    /**
     * 開閉動作
     */
    Slidebar.prototype.toggle = function () {
        if ( this.isActive === false ){
            this.open();
        } else {
            this.close();
        }
    }

    Slidebar.prototype.bodyTrigger = function(){
        var self = this;
        $(document).on('click', this.options.containerSelector, function(e){
            if ( self.isActive ){
                self.close();
            }
        });
    }

    Slidebar.prototype.open = function () {
        $("body").addClass('is-slidebar-active');
        this.isActive = true;
    }

    Slidebar.prototype.close = function () {
        $("body").removeClass('is-slidebar-active');
        this.isActive = false;
    }

    $(function(){
       var slidebar = new Slidebar();
        slidebar.init();
    });


})(window.jQuery);
