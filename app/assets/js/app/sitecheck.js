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
     * 初期化
     * @type {{}}
     */
    var defaultOptions = {

        // 実行判断
        selector: ".js-sitecheck",

        // 見出しタグのセレクタ
        headingSelector: {
            "h1": {
                color: "#FF5B5B",
            },
            "h2": {
                color: "#9770EA",
            },
            "h3": {
                color: "#CBDC7C",
            },
            "h4": {
                color: "#AA96D1",
            },
            "h5": {
                color: "#A2A2A2",
            },
            "h6": {
                color: "#f00",
            }
        },

        // meta タグのセレクタ
        metaSelector: ["title", 'meta[name="robots"]', 'meta[name="description"]', 'meta[name="keywords"]', 'meta[name="viewport"]'],

        // OGPタグのセレクタ
        ogpSelector: [
            'meta[property="og:locale]"',
            'meta[property="og:title"]',
            'meta[property="og:type"]',
            'meta[property="og:url"]',
            'meta[property="og:image"]',
            'meta[property="og:site_name"]',
            'meta[property="og:description"]',
            'meta[name="twitter:card"]',
            'meta[name="twitter:description"]',
            'meta[name="twitter:title"]',
            'meta[name="twitter:image"]',
        ],

        metaCheck: true,
        headingCheck: true,

    }

    /**
     * コンストラクタ
     * @constructor
     */
    var SiteCheck = function (options) {
        this.options = $.extend(defaultOptions, options);
        this.debugBar = "";
        this.debugBarContent = "";
        this.isDebugBarOpen = false;
        this.isDebugBarInit = false;
    }

    SiteCheck.prototype.init = function () {

        // .js-sitecheck が存在しない場合は実行しない
        if ($(".js-sitecheck").length === 0) {
            return false;
        }

        this.toggleInit()
        this.addStyleSheet();
        this.addBar();
        this.scriptsCheck();
    }

    /**
     * トグルを追加する
     */
    SiteCheck.prototype.toggleInit = function () {

        // 見出しチェックのトグルボタン
        var wrap = $('<div class="sc-togglebtn"></div>');
        var titleCheckBtn = $("<a></a>");
        var self = this;
        titleCheckBtn.addClass("sc-togglebtn__title");
        titleCheckBtn.text("見出しタグをチェック");
        titleCheckBtn.on('click', function () {
            self.headingCheck();
        });
        wrap.append(titleCheckBtn);

        // バーのトグルボタン
        var barDisplayBtn = $("<a></a>");
        var self = this;
        barDisplayBtn.addClass("sc-togglebtn__bar");
        barDisplayBtn.text("バーを開く");

        barDisplayBtn.on('click', function () {
            // self.debugBar.slideToggle().toggleClass("is-close");
            if (self.debugBar.hasClass("is-close")) {
                self.debugBar.slideDown().removeClass('is-close');
                $(this).text("バーを開く");
            } else {
                self.debugBar.slideUp().addClass('is-close');
                $(this).text("バーを閉じる");
            }
        });
        wrap.append(barDisplayBtn);

        // リンクチェック
        var linkCheckBtn = $("<a></a>");
        var self = this;
        linkCheckBtn.addClass("sc-togglebtn__checklink");
        linkCheckBtn.text("リンク切れチェック");

        linkCheckBtn.on('click', function () {
            self.checkLink();
        });

        wrap.append(linkCheckBtn);
        $('body').append(wrap);
    }

    /**
     * リンク切れチェック
     */
    SiteCheck.prototype.checkLink = function () {
        var links = $("a");
        var links_length = links.length;

        var results = {
            success: 0,
            faild: 0,
            moved: 0,
        };

        var d = new $.Deferred();
        var dp = d.promise();
        $.each(links, function (key, link) {
            var linktag = $(link);
            var href = linktag.attr("href");
            if (href && href !== "") {
                $.ajax({
                    type: "get",
                    url: "http://grow-group.jp/tools/broken-link-checker.php?url=" + href,
                    success: function (res) {
                        if (res.status === "200") {
                            results.success++;
                        }
                        if (res.status === "404") {
                            results.faild++;
                        }


                        if (key === links_length - 1) {
                            console.log(results);
                        }
                    },
                    error: function (res) {
                        results.faild++;
                    }
                }).;
            } else {

            }
        });

    }

    /**
     * Google Analitics が設置されているかどうか判断する
     */
    SiteCheck.prototype.scriptsCheck = function () {
        // 2: detect by script tags
        var script_tests = {
            'Google Analytics': /google-analytics.com\/(ga|urchin).js/i,
            'AdSense': /pagead\/show_ads\.js/,
        };

        var apps = [];

        // Analitics
        if (typeof window.ga === "function") {
            apps.push("Google Analitics");
        }

        // Adsense
        if (typeof window.adsbygoogle === "object") {
            apps.push("Google Adsense");
        }

        this.addSeoBarSectionTitle("Scripts");
        var content = $('<div />');
        for (var i = 0; i < apps.length; i++) {
            content.append("<div>" + apps[i] + "</div>");
        }
        this.addSeoBarSection(content);

    }

    /**
     * 見出しをチェック
     */
    SiteCheck.prototype.headingCheck = function () {
        var headings = Object.keys(this.options.headingSelector);
        var self = this;
        $.each(headings, function (head_key, heading) {
            var tag = $(heading);
            tag.hide();
            tag.css('outline', "10px solid " + self.options.headingSelector[heading].color);
            tag.css('outline-offset', "8px");
            tag.fadeIn(300);
            self.addTooltip(heading, heading)
        });
    }

    /**
     * ツールチップを追加
     * @param target
     * @param text
     */
    SiteCheck.prototype.addTooltip = function (target, text) {
        $(target).css('position', 'relative');
        var tooltip = $('<div class="sc-tooltip">' + text + '</div>');
        $(target).hover(function () {
            $(this).find(".sc-tooltip").show();
        }, function () {
            $(this).find(".sc-tooltip").hide();
        });
        $(target).append(tooltip);
    }


    /**
     * SEOチェックバーを表示
     */
    SiteCheck.prototype.addBar = function () {
        var self = this;

        var bar = $("<div></div>");
        var content = $("<div></div>");
        var barClick = $("<a></a>");


        bar.addClass("is-close");
        barClick.addClass("sc-bar__click");
        barClick.text("Close");
        this.debugBar = bar;
        this.debugBarContent = content;
        this.debugBarContent.addClass("sc-bar-content");

        // classを付与
        this.debugBar.addClass('sc-bar');

        // メタ情報を付与
        this.addMeta();

        this.debugBar.append(this.debugBarContent);
        this.debugBar.append(barClick);

        barClick.click(function (e) {
            self.debugBar.toggleClass("is-close");
            if (self.debugBar.hasClass("is-close")) {
                $(this).text("閉じる");
            } else {
                $(this).text("Open");
            }
        });
        $('body').append(this.debugBar);

        // ステータスを切り替え
        this.isDebugBarInit = true;
    }

    /**
     * バーを表示
     */
    SiteCheck.prototype.barShow = function (button) {
        this.debugBar.addClass("is-close");
        $(button).text("Open");
    }

    // バーを非表示
    SiteCheck.prototype.barHide = function () {
        this.debugBar.removeClass("is-close");
        $(button).text("Close");
    }


    /**
     * メタタグ
     */
    SiteCheck.prototype.addMeta = function () {

        this.addSeoBarSectionTitle("meta");

        // metaタグを追加
        for (var i = 0; i < this.options.metaSelector.length; i++) {
            var meta = this.options.metaSelector[i];
            var metaDom = $(meta);
            var text = '<div class="sc-bar__content__title">' + meta + "</div>";
            var value;
            if (meta === "title") {
                value = metaDom.text();
            } else {
                value = metaDom.attr('content');
            }
            if (!value) {
                value = "設定なし";
            }
            text += "<code>" + value + "</code>";
            this.addSeoBarSection(text);
        }

        // OGPタグを追加
        this.addSeoBarSectionTitle("OGP");
        for (var i = 0; i < this.options.ogpSelector.length; i++) {
            var meta = this.options.ogpSelector[i];
            var metaDom = $(meta);
            var text = '<div class="sc-bar__content__title">' + meta + "</div>";
            var value;
            if (meta === "title") {
                value = metaDom.text();
            } else {
                value = metaDom.attr('content');
            }
            if (!value) {
                value = "設定なし";
            }
            text += "<code>" + value + "</code>";
            this.addSeoBarSection(text);
        }
    }

    /**
     * セクションを追加
     */
    SiteCheck.prototype.addSeoBarSection = function (text) {
        var content = $('<div />');
        content.addClass("sc-bar__content")
        content.append(text);
        this.debugBarContent.append(content);
    }

    /**
     * タイトルを追加
     */
    SiteCheck.prototype.addSeoBarSectionTitle = function (text) {
        var title = $('<div />');
        title.addClass('sc-bar__title');
        title.text(text);
        this.debugBarContent.append(title);
    }

    /**
     * スタイルシートを追加
     */
    SiteCheck.prototype.addStyleSheet = function () {
        var settings = {

            '.sc-tooltip': {
                'display': 'none',
                'color': '#fff',
                'position': 'absolute',
                'right': "5px",
                'bottom': "5px",
                'font-size': "12px",
                'padding': "6px 10px",
                'border': "1px solid rgba(255,255,255,0.6)",
                'border-radius': "4px",
                'transration': "none",
                'z-index': "1000000000000",
                'background-color': ['rgba(0,0,0,0.7)', true] // 'true' for !important rules
            },
            '.sc-bar': {
                'display': 'block',
                'color': '#fff',
                'position': 'fixed',
                'left': "0px",
                'z-index': "1000000000000",
                'width': "100%",
                'font-size': "12px",
                'padding': "6px 10px",
                'font-family': ["sans-self", true],
                'background-color': ['rgba(0,0,0,0.9)', true],
                'top': '0px',
                'overflow': 'auto',
                'height': "680px",
                'max-height': "100%",
                'transition': "all ease-in-out .4s",
            },
            '.sc-bar.is-close': {
                'display': 'block',
                'color': '#fff',
                'position': 'fixed',
                'left': "0px",
                'z-index': "1000000000000",
                'overflow': "hidden",
                'top': '-1000px',
                'font-size': "12px",
                'height': "0px",
                'transition': "all ease-in-out .4s",
                'padding': "6px 10px",
                'background-color': ['rgba(0,0,0,0.9)', true]
            },
            '.sc-bar .sc-bar__title': {
                'font-size': "18px",
                'border-bottom': "1px solid #fff",
                'padding-bottom': "5px",
                'margin-bottom': "10px",
            },
            '.sc-bar .sc-bar__content': {
                'font-size': "13px",
                'padding-bottom': "3px",
                'margin-bottom': "1px",
            },
            '.sc-bar .sc-bar__content .sc-bar__content__title ': {
                'display': "inline-block",
                'min-width': "300px",
                'font-size': "13px",
                'padding-bottom': "4px",
                'margin-bottom': "0px",
            },
            '.sc-bar .sc-bar__content code': {
                'font-size': "14px",
                'color': "#fff",
                'padding-bottom': "5px",
                'margin-bottom': "0px",
                'padding-left': "5px",
                'padding-right': "5px",
                'display': "inline-block",
                'background': "#000",
                'border': "none",
            },
            '.sc-bar.is-close .sc-bar-content': {
                'display': "none",
            },
            '.sc-bar.is-close .sc-bar__click': {
                'position': "absolute",
                'top': "0",
                'left': "0",
            },
            '.sc-bar .sc-bar__click': {
                'font-size': "16px",
                'display': "block",
                'line-height': "20px",
                'color': "#fff",
                // 'position': "ab",
                'padding-top': "5px",
                'padding-bottom': "5px",
                'margin-bottom': "3px",
                'padding-left': "5px",
                'padding-right': "5px",
                'text-align': "center",
                'background': "#D44040"
            },
            '.sc-bar .sc-bar__click:hover': {
                'text-decoration': "none",
                'background': "#D44040"
            },
            '.sc-togglebtn': {
                'position': "fixed",
                'right': "0",
                'z-index': "10000000000",
                'bottom': "50px",
                'width': "200px;"
            },
            '.sc-togglebtn > a': {
                'display': "inline-block",
                'width': "100%",
                'background': "#000",
                'border-radius': "1000px",
                'padding': "10px 20px",
                'color': "#fff",
                'font-size': "12px",
                'margin-bottom': "10px",
            },

            '.sc-togglebtn > a:hover': {
                'text-decoration': "none",
                'opacity': "0.7",
            }
        }
        this.addStyleSheetRules(settings);
    }

    /**
     * styleタグを生成
     * @param rules
     */
    SiteCheck.prototype.addStyleSheetRules = function (rules) {
        var styleEl = document.createElement('style');
        document.head.appendChild(styleEl);

        styleEl.appendChild(document.createTextNode(''));
        var s = styleEl.sheet;
        for (var selector in rules) {
            var props = rules[selector];
            var propStr = '';
            for (var propName in props) {
                var propVal = props[propName];
                var propImportant = '';
                if (propVal[1] === true) {
                    propVal = propVal[0];
                    propImportant = ' !important'
                }
                propStr += propName + ':' + propVal + propImportant + ';\n';
            }
            s.insertRule(selector + '{' + propStr + '}', s.cssRules.length);
        }
    }


    $(function () {
        GApp.SiteCheck = new SiteCheck();
        GApp.SiteCheck.init();
    });

})(jQuery);
