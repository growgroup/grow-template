/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 *
 * # example:
 * <div class="js-heightline"></div>
 * <div class="js-heightline"></div>
 * <div class="js-heightline"></div>
 *
 * or
 *
 * <div class="c-example" data-heightline-group="example1"></div>
 * <div class="c-example" data-heightline-group="example1"></div>
 * <div class="c-example" data-heightline-group="example1"></div>
 * <div class="c-example" data-heightline-group="example2"></div>
 * <div class="c-example" data-heightline-group="example2"></div>
 * <div class="c-example" data-heightline-group="example2"></div>
 *
 */
import  $ from "./jquery-shim.js"
import Utils from "./utils.js"
import imagesLoaded from "imagesloaded"

imagesLoaded.makeJQueryPlugin($);

const util = new Utils()

var defaultOptions = {
    columns: 3,
    selector: ".js-heightline",
    dataAttribute: "heightline-group",
    property: "minHeight", // or min-height
    mobile: true,
    responsive: {
        "640": {
            columns: 2
        }
    }
}

export default class Heightline {

    /**
     * 初期化
     * @param options
     */
    constructor(options) {
        this.options = $.extend(defaultOptions, options);
        this.init();
    }

    /**
     * 初期化
     */
    init() {

        // ターゲットとなる要素をセットする

        this.elements = document.querySelectorAll(this.options.selector);

        this.bulkElements = $("*[data-" + this.options.dataAttribute + "]");

        // 最大の高さを格納
        this.maxHeight = 0;

        this.currentColumns = 0;

        this.setResposiveOption();

        if (this.options.mobile === false && util.isMobile()) {
            return false;
        }

        $(this.options.selector + "," + "*[data-" + this.options.dataAttribute + "]").imagesLoaded(() => {
            this.run();
            this.bulkRun();
        })
    }

    /**
     * レスポンシブの設定
     */
    setResposiveOption() {
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
    run() {

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
                this.elements[i].style[this.options.property] = this.maxHeight + "px";
            }
        }
    }

    /**
     * データ属性のグループに応じて高さをあわせる
     */
    bulkRun() {

        var formatElement = {};
        var self = this;


        for (var i = 0; i < this.bulkElements.length; i++) {
            var el = this.bulkElements[i];

            var groupKey = $(el).data(this.options.dataAttribute);

            if (!$.isArray(formatElement[groupKey])) {
                formatElement[groupKey] = [];
            }
            formatElement[groupKey].push(el);
        }


        for (var key in formatElement) {
            var tempElements = [];

            var groupEl = formatElement[key];

            for (var gi = 0; gi < groupEl.length; gi++) {
                var singleEl = groupEl[gi];

                if (this.maxHeight < singleEl.clientHeight) {
                    this.maxHeight = singleEl.clientHeight;
                }
                singleEl.originalHeight = singleEl.clientHeight;
                tempElements.push(singleEl);
            }

            for (var gi = 0; gi < tempElements.length; gi++) {
                $(tempElements[gi]).css(this.options.property, this.maxHeight + "px");
            }
            this.maxHeight = 0;
        }

    }

    /**
     * リセット
     */
    reset() {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style[this.options.property] = this.elements[i].originalHeight + "px";
        }
    }

}
