/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */
import  $ from "./jquery-shim.js"


var defaultOptions = {
    selector: ".js-tabs", // 実行するタブを包括するセレクタ
    activeClass: "is-active", // 有効時に付与する class
    navsClass: ".c-tabs__navs,.js-tabs-nav", // ナビゲーションのクラス
    navTargetAttr: "data-tab-target",
    paneNameAttr: "data-tab-name",
    paneClass: ".c-tabs__content,.js-tabs-content",
}

export default class Tab {

    constructor(options) {
        this.options = $.extend(options, defaultOptions);
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.wrapper = $(this.options.selector);
        this.navs = this.wrapper.find('*[' + this.options.navTargetAttr + ']');
        this.panes = this.wrapper.find('*[' + this.options.paneNameAttr + ']');
        this.onClick();

    }

    /**
     * クリック時の動作
     */
    onClick() {

        var self = this;
        this.navs.on('click', function (e) {
            e.preventDefault();
            self.panes.removeClass(self.options.activeClass);
            self.navs.removeClass(self.options.activeClass);
            $(this).addClass(self.options.activeClass);
            var targetName = $(this).attr(self.options.navTargetAttr);
            for (var i = 0; i < self.panes.length; i++) {
                if (targetName === $(self.panes[i]).attr(self.options.paneNameAttr)) {
                    $(self.panes[i]).addClass(self.options.activeClass);
                }
            }
        });
    }

}
