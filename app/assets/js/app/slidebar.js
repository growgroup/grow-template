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
        this.prototype.toggle = this.prototype.toggle.bind(this);
        $("body").addClass('slidebar-init')
    }

    Slidebar.prototype.trigger = function () {

        var self = this;
        $(document).on('click', this.options.buttonSelector, function(e){
            e.preventDefault();
            self.toggle();
        });
    }

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
