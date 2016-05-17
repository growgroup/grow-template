/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */

(function ($) {

    var defaultOptions = {
        selector: ".js-table,.tablepress"
    }

    var ResponsiveTable = function (options) {
        this.options = $.extend(defaultOptions, options);
    }

    /**
     * 初期化
     */
    ResponsiveTable.prototype.init = function () {
        this.tables = $(this.options.selector);
        this.run();
    }

    /**
     * 実行
     */
    ResponsiveTable.prototype.run = function () {

        for (var i = 0; i < this.tables.length; i++) {
            var wrapper = $('<div class="js-responsive-table"></div>');
            var table = this.tables[i];
            wrapper.append($(table).clone());
            $(table).after(wrapper);
            $(table).remove();
        }
    }

    $(function () {
        var table = new ResponsiveTable();
        table.init();
    });


})(jQuery);
