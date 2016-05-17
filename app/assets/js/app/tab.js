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

    var defaultOptions = {
        selector: ".js-tabs", // 実行するタブを包括するセレクタ
        activeClass: "is-active", // 有効時に付与する class
        navsClass: ".c-tabs__navs", // ナビゲーションのクラス
        navTargetAttr: "data-tab-target",
        paneNameAttr: "data-tab-name",
        paneClass: ".c-tabs__content",
    }


    var Tab = function(options){
        this.options = $.extend( options, defaultOptions );
    }

    /**
     * 初期化
     */
    Tab.prototype.init = function(){
        this.wrapper = $(this.options.selector);
        this.navs = this.wrapper.find('*[' + this.options.navTargetAttr + ']');
        this.panes = this.wrapper.find('*[' + this.options.paneNameAttr + ']');

        this.onClick();

    }

    /**
     * クリック時の動作
     */
    Tab.prototype.onClick = function(){

        var self = this;
        this.navs.on('click',function(e){
            e.preventDefault();
            self.panes.removeClass(self.options.activeClass);
            self.navs.removeClass(self.options.activeClass);
            $(this).addClass(self.options.activeClass);
            var targetName = $(this).attr(self.options.navTargetAttr);
            for( var i = 0; i < self.panes.length; i++ ){
                if ( targetName === $(self.panes[i]).attr( self.options.paneNameAttr ) ){
                    $(self.panes[i]).addClass(self.options.activeClass);
                }
            }

        });
    }

    $(function(){
        GApp.Tab = new Tab();
        GApp.Tab.init();

    });

})(jQuery);
