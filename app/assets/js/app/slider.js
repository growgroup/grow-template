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

    // 初期設定
    var defaultOptions = {
        'namespace': "c-slider",
        'selector': ".js-slider",
        'itemSelector': " > *",
        'animation': 'slide',
        'animationTimeout': '4000',
        'items': 1,
        'margin': 0,
        'speed': 500,
        'autoplayTimeout': 5000,
        'autoplay': false,
        'nav': true,
        'dot': true,
        'screenAll': true,
        'navNext': '<span class="c-slider__next"> > </span>',
        'navPrev': '<span class="c-slider__prev"> < </span>',
    }

    var Slider = function (options) {
    }

    /**
     * 実行
     */
    Slider.prototype.init = function (options) {

        this.options = $.extend(defaultOptions, options);

        Slider.prototype.watch = Slider.prototype.watch.bind(this);

        // デバッグモード
        this.debug = true;

        // スライドさせる要素
        this.container = $(this.options.selector);

        // デフォルトのノードを保管しておく
        this.defaultContainer = this.container.clone();

        // スライドさせる要素をセット
        this.initializeItems();

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

        this.isAutoplay = true;

        this.cloneItems();
        this.setOuter();
        this.setNav();
        this.addEventListener();
        this.setInfo();
        this.watch();

        // this.debug();
    }

    /**
     * 画面情報を保存
     */
    Slider.prototype.setInfo = function () {
        this.info = {
            windowWidth: window.outerWidth,
            windowHeight: window.outerWidth
        }
    }
    /**
     * ネームスペースを取得
     */
    Slider.prototype.getClass = function (name) {
        return this.options.namespace + name;
    }


    /**
     * アイテムを初期化
     */
    Slider.prototype.initializeItems = function () {
        var items = this.container.find(this.options.itemSelector)

        for (var i = 0; i < items.length; i++) {

            var item = $(items[i]);
            item.attr("data-slider-key", i);

            if (this.options.screenAll) {
                item.css("width", $(window).width());
            }
        }
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
            var $cloneItem = $(cloneItems[i]).addClass('cloned').removeAttr("data-slider-key");
            if (i >= (cloneItemsLength / 2)) {
                this.container.prepend($cloneItem);
            } else {
                this.container.append($cloneItem);
            }
        }

        this.originalItems = this.items;
        this.items = this.container.find(this.options.itemSelector);
        this.items.each(function (key) {
            $(this).attr("data-slider-key", key)
        })
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
        this.setOuterWidth();
        this.centerdOuter();
    }


    /**
     * ドラッグに対応
     */
    Slider.prototype.eventDragAndDrop = function () {

        var self = this;


        this.outer.on('mousedown touchstart', function (e) {
            var touchX = e.pageX;

            if (typeof e.originalEvent.changedTouches !== "undefined") {
                touchX = e.originalEvent.changedTouches[0].pageX;
            }

            self.slideX = $(this).position().left;
            self.outer.removeClass("is-transition");
            self.isAutoplay = false;
            $(this).on('mousemove touchmove', function (e) {
                e.preventDefault();
                var pageX = e.pageX;
                if (typeof e.originalEvent.changedTouches !== "undefined") {
                    pageX = e.originalEvent.changedTouches[0].pageX;
                }
                self.outer.removeClass("is-transition");
                var slideX = self.slideX - (touchX - pageX);
                self.currentOuterPosition = slideX;
                var translate = 'translate3d(' + self.currentOuterPosition + 'px,0px,0px)'
                self.outer.css('transform', translate);
            });
        });


        this.outer.on('mouseup touchend', function (e) {
            $(this).off('mousemove touchmove');
            // self.outer.addClass("is-transition");
            var itemWidth = $(self.items[self.currentItemId]).width() / 9;
            var position = ( (-self.currentOuterPosition ) - ($(self.items[self.currentItemId]).width() * (self.currentItemId)) );

            if (position > itemWidth) {
                if (self.currentItemId === self.items.length - 1) {
                    self.currentItemId = 0;
                    isLoop = true;
                } else {
                    self.currentItemId++;
                }
                // self.moveTo(self.currentItemId, isLoop, 'next');
            } else if (position < ( -itemWidth )) {
                var isLoop = false;
                if (self.currentItemId === 0) {
                    self.currentItemId = self.items.length - 1;
                    isLoop = true;
                } else {
                    self.currentItemId--;
                }
                // self.moveTo(self.currentItemId, isLoop, 'prev');
            }
            self.isDragEnd = true;
            self.isAutoplay = true;
        });

    }

    /**
     * アウターを更新
     */
    Slider.prototype.setOuterWidth = function () {
        this.outer.width(this.outerWidth);
    }

    /**
     * アウターを更新
     */
    Slider.prototype.updateOuterPosition = function (position, isLoop, method) {

        this.currentOuterPosition = position;
        this.isAutoplay = false;
        if ( ! isLoop ) {
            this.outer.addClass("is-transition");
        }
        var translate = 'translate3d(' + this.currentOuterPosition + 'px,0px,0px)'
        this.outer.css('transform', translate);
        var self = this;
        if ( isLoop ){
            if ( method == "next" ){
                self.next();
            } else {
                self.prev();
            }

        }
        setTimeout(function () {
            self.outer.removeClass("is-transition");
            self.isAutoplay = true;

        }, this.options.animationTimeout / 10)


    }
    /**
     * アウターをセンターに合わせる
     */
    Slider.prototype.centerdOuter = function () {
        var halfKey = Math.round(this.originalItems.length / 2);

        this.currentItemId = halfKey;
        var translate = 'translate3d(' + this.getItemWidth(halfKey) + 'px,0px,0px)'
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


    Slider.prototype.calcItemWidth = function () {
        this.outerWidth = width;
    }

    /**
     * 移動する
     */
    Slider.prototype.moveTo = function (to, isLoop,method) {
        var position = this.getItemWidth(to);
        this.items.removeClass('is-active');
        $(this.items[to]).addClass('is-active');
        this.updateOuterPosition(position, isLoop,method);
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


        var count = 0;
        for (var i = 0; i < idx; i++) {
            tempWidth += $(this.items[i]).width();
            count++;
        }
        return -tempWidth;
    }

    /**
     * キーから取得する
     */
    Slider.prototype.getItemFromKey = function (key) {
        $.each(this.originalItems, function () {
            if ($(this).attr('data-slider-key') === key) {
                return true;
            }
        })
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
        var isLoop = false;


        if (this.currentItemId === this.items.length - 1) {
            this.currentItemId = 0;
            isLoop = true;
        } else {
            this.currentItemId++;
        }

        this.moveTo(this.currentItemId,isLoop, "next");
    }
    /**
     * 前のスライドへ移動する
     */
    Slider.prototype.prev = function () {
        var isLoop = false;
        if (this.currentItemId === 0) {
            this.currentItemId = this.items.length - 1;
            isLoop = true;
        } else {
            this.currentItemId--;
        }

        this.moveTo(this.currentItemId, isLoop, 'prev');

    }

    /**
     * スライダーを再構築する
     */
    Slider.prototype.refresh = function () {
        this.destroy();
        this.init();
    }


    /**
     * ドットを表示
     */
    Slider.prototype.setDots = function () {
    }

    /**
     * スライダーを破棄する
     */
    Slider.prototype.destroy = function () {

        this.container.after(this.defaultContainer);
        this.container.remove();

        for (var key in this) {
            delete this[key];
        }
    }

    /**
     * スライダーを見張る
     */
    Slider.prototype.watch = function (timestamp) {


        if (this.info.windowWidth !== window.outerWidth) {
            this.refresh();
        }
        this.setInfo();

        if (this.options.autoplay && this.isAutoplay) {
            if (Math.floor(timestamp) % (this.options.autoplayTimeout) / 1000 * 60 <= 1) {
                this.next()
            }
        }

        if (this.isDragEnd) {
            this.moveTo(this.currentItemId)
            this.isDragEnd = false;
        }

        window.requestAnimationFrame(this.watch);
    }

    /**
     * ドットを表示
     */
    Slider.prototype.log = function (text) {
        if (this.debug === true) {
            console.dir(text);
        }
    }

    /**
     * デバッグ用
     */
    Slider.prototype.debug = function () {
        this.log(this);
    }


    $(function () {
        var slider = new Slider();
        slider.init();

    });

})(jQuery);
