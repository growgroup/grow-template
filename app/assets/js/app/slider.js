/*
 * ====================================================================
 * Grow Template
 * @package  Grow Template
 * @author   GrowGroup.Inc <info@grow-group.jp>
 * @license  MIT Licence
 * ====================================================================
 */

;(function ($) {
    "use strict";


    var defaultOptions = {
        'namespace': "c-slider",
        'selector': ".js-slider",
        'itemSelector': " > *",
        'animation': 'slide',
        'items': 1,
        'margin': 0,
        'speed': 500,
        'timeout': 2000,
        'autoplay': true,
        'nav': true,
        'dot': true,
        'navNext': '<span class="c-slider__next"> > </span>',
        'navPrev': '<span class="c-slider__prev"> < </span>',
    }

    var Slider = function (options) {
        this.options = $.extend(defaultOptions, options);
    }

    var Item = function(el){
        this.instance = el;
    }

    /**
     * ポジションをセットする
     */
    Item.prototype.setPosition = function(){

    }

    /**
     * 実行
     */
    Slider.prototype.init = function () {

        // デバッグモード
        this.debug = true;

        // スライドさせる要素
        this.container = $(this.options.selector);

        // スライドさせる要素をセット
        this.items = this.container.find(this.options.itemSelector);

        this.item = [];

        //  アイテム数
        this.item.length = this.items.length;

        // アイテムの高さ
        this.item.height = 0;

        // アイテムの幅
        this.item.width = 0;

        // アウターの幅
        this.outer = [];

        // アウターの幅
        this.outer.width = 0;

        // アウターの高さ
        this.outer.height = 0;

        // 現在のポジション
        this.currentOuterPosition = 0;

        // 現在のアイテムID
        this.currentItemId = 0;

        this.cloneItems();
        this.setOuter();
        this.setNav();
        this.addEventListener();


    }

    /**
     * ネームスペースを取得
     */
    Slider.prototype.getClass = function (name) {
        return this.options.namespace + name;
    }


    /**
     * アイテムを複製する
     */
    Slider.prototype.cloneItems = function () {

        var cloneItemsLength = 0;
        var cloneItems = [];
        if (this.items.length % 2 === 1) {
            cloneItemsLength = this.items.length + 1;
            cloneItems = this.items.clone();
            cloneItems.push($(this.items[this.items.length - 2]).clone()[0]);
        } else {
            cloneItemsLength = this.items.length;
            cloneItems = this.items.clone();
        }

        for (var i = 0; i < cloneItemsLength; i++) {
            var $cloneItem = $(cloneItems[i]).addClass('cloned');
            if (i >= (cloneItemsLength / 2)) {
                this.container.prepend($cloneItem);
            } else {
                this.container.append($cloneItem);
            }
        }
        this.items = this.container.find(this.options.itemSelector);
    }

    /**
     * アウターをセット
     */
    Slider.prototype.setOuter = function () {
        this.outer = $('<div />');
        this.outer.addClass(this.getClass('-outer'));
        this.outer.append(this.items);
        this.container.append(this.outer);
        this.calcOuterWidth();
        this.updateOuterWidth();

        this.outer.css("transform", 'translate3d(0,0,0)')
    }
    /**
     * アウターをセット
     */
    Slider.prototype.eventDragAndDrop = function () {

        var self = this;

        var temptran;
        this.outer.on('mousedown', function(e){

            var touchX = e.pageX;
            self.slideX = $(this).position().left;
            $(this).on('mousemove',function(e){
                e.preventDefault();
                var slideX = self.slideX - (touchX - e.pageX);
                self.moveTo(slideX);
                if ( ! temptran ) {
                    temptran = $(this).css("transition");
                    $(this).css("transition", "");
                }
            });
        });

        this.outer.on('mouseup', function(e){
            $(this).off('mousemove');
            $(this).css("transition",temptran);
            temptran = false;
        });



    }

    /**
     * アウターを更新
     */
    Slider.prototype.updateOuterWidth = function () {
        this.outer.width(this.outerWidth);
    }
    /**
     * アウターを更新
     */
    Slider.prototype.updateOuterPosition = function (position) {

        if (position) {
            this.currentOuterPosition = position;
        }

        var translate = 'translate3d(' + this.currentOuterPosition + 'px,0px,0px)'
        this.outer.css('transform', translate);
    }


    /**
     * アウターの幅を計算
     */
    Slider.prototype.calcOuterWidth = function () {
        var width = 0;
        this.items.map(function (idx, el, array) {
            var tempWidth = $(el).innerWidth();
            width += tempWidth;
            $(el).width(tempWidth);
        });
        this.outerWidth = width;
    }

    /**
     * アウターの幅を計算
     */
    Slider.prototype.calcItemWidth = function () {
        this.outerWidth = width;
    }

    /**
     * 移動する
     */
    Slider.prototype.moveTo = function (position) {

        this.updateOuterPosition(position);
    }

    /**
     * ナビゲーションをセット
     */
    Slider.prototype.setNav = function () {
        this.navs = $('<div />');
        this.navs.addClass(this.getClass('__nav'));

        this.navPrev = $(this.options.navPrev);
        this.navNext = $(this.options.navNext);
        this.navs.append(this.navPrev);
        this.navs.append(this.navNext);
        this.container.append(this.navs);
    }


    /**
     * 次のスライドへ移動する
     */
    Slider.prototype.addEventListener = function () {
        this.navNext.on('click', this.next.bind(this));
        this.navPrev.on('click', this.prev.bind(this));
        this.eventDragAndDrop();
    }

    /**
     * アイテムの幅を取得する
     * @param idx
     * @returns {*}
     */
    Slider.prototype.getItemWidth = function (idx) {
        var tempWidth = 0;
        for (var i = 0; i < idx; i++) {
            tempWidth += $(this.items[i]).width();
        }
        return tempWidth - $(this.items[i]).width() / 1.5;
    }


    /**
     * 現在のアイテムを更新
     */
    Slider.prototype.updateCurrentItem = function () {

    }

    /**
     * 前のスライドへ移動する
     */
    Slider.prototype.next = function () {
        if (this.currentItemId === (this.items.length - 1)) {
            this.currentItemId = 0;
        } else {
            this.currentItemId++;
        }

        this.log(this.currentItemId);
        this.moveTo(this.getItemWidth(this.currentItemId));
    }
    /**
     * 前のスライドへ移動する
     */
    Slider.prototype.prev = function () {
        if (this.currentItemId === 0) {
            this.currentItemId = this.items.length;
        } else {
            this.currentItemId--;
        }

        this.moveTo(this.getItemWidth(this.currentItemId));
    }

    /**
     * 再構築する
     */
    Slider.prototype.reflesh = function () {

    }

    /**
     * 自動再生
     */
    Slider.prototype.autoplay = function () {

    }

    /**
     * ドットを表示
     */
    Slider.prototype.showDots = function () {

    }

    /**
     * ドットを表示
     */
    Slider.prototype.log = function (text) {
        if (this.debug === true) {
            console.dir(text);
        }
    }


    $(function () {
        var slider = new Slider();
        slider.init();
    });

})(jQuery);
