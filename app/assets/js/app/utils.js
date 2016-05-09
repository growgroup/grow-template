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

    var GApp = window.GApp || {};


    var toString = Object.prototype.toString;

    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys;

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    var Utils = function () {
    }

    /**
     * 単位を変換
     * @param i
     * @param units
     */
    Utils.prototype.unit = function (i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    /**
     * 配列かどうか
     * @param collection
     * @returns {boolean}
     */
    Utils.prototype.isArrayLike = function (collection) {
        var length = collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    Utils.prototype.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    /**
     * 配列か判別
     * @type {*|Function}
     */
    Utils.prototype.isArray = nativeIsArray || function (obj) {
            return toString.call(obj) === '[object Array]';
        };


    Utils.prototype.keys = function (obj) {
        if (!Utils.prototype.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if ($.inArray(obj, key)) keys.push(key);

        return keys;
    };
    /**
     * オブジェクトが空かどうか判断
     * @param obj
     * @returns {boolean}
     */
    Utils.prototype.isEmpty = function (obj) {
        if (obj == null) return true;
        if (Utils.prototype.isArrayLike(obj) && (Utils.prototype.isArray(obj) || Utils.prototype.isString(obj) || Utils.prototype.isArguments(obj))) return obj.length === 0;
        return Utils.prototype.keys(obj).length === 0;
    }

    // その他型調査用
    $.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (key, name) {
        Utils.prototype['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    /**
     * モバイル端末か判別
     * @returns {boolean}
     */
    Utils.prototype.isMobile = function () {
        var ua = navigator.userAgent;

        if (screen.width < 768) {
            return true;
        }

        var isMobile = {
            Android: function () {
                return ua.match(/Android/i);
            },
            BlackBerry: function () {
                return ua.match(/BlackBerry/i);
            },
            iPhone: function () {
                return ua.match(/iPhone/i);
            },
            Opera: function () {
                return ua.match(/Opera Mini/i);
            },
            Windows: function () {
                return ua.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iPhone() || isMobile.Opera() || isMobile.Windows());
            }
        }

        if (!Utils.prototype.isEmpty(isMobile.any())) {
            return true;
        }

        return false;
    }

    /**
     * クエリーをパース
     * @param string
     * @returns {{}}
     */
    Utils.prototype.parseQueryString = function (string) {

        var parsed = {};
        string = (string !== undefined) ? string : window.location.search;

        if (typeof string === "string" && string.length > 0) {
            if (string[0] === '?') {
                string = string.substring(1);
            }

            string = string.split('&');

            for (var i = 0, length = string.length; i < length; i++) {
                var element = string[i],
                    eqPos = element.indexOf('='),
                    keyValue, elValue;

                if (eqPos >= 0) {
                    keyValue = element.substr(0, eqPos);
                    elValue = element.substr(eqPos + 1);
                }
                else {
                    keyValue = element;
                    elValue = '';
                }

                elValue = decodeURIComponent(elValue);

                if (parsed[keyValue] === undefined) {
                    parsed[keyValue] = elValue;
                }
                else if (parsed[keyValue] instanceof Array) {
                    parsed[keyValue].push(elValue);
                }
                else {
                    parsed[keyValue] = [parsed[keyValue], elValue];
                }
            }
        }

        return parsed;
    }

    /**
     * クエリを指定したキーから取得する
     * @param key
     * @param string
     * @returns {boolean}
     */
    Utils.prototype.getQueryString = function (key, string) {
        var string = (string !== undefined) ? string : window.location.search;
        var queries = Utils.prototype.parseQueryString();
        var match = false;
        $.each(queries, function (qkey, value) {
            if (key === qkey) {
                match = value;
                return false;
            }
        });
        return match;
    }

    /**
     * requestAnimationFrame のPolyfil
     * @returns {*}
     */
    Utils.prototype.requestAnimationFrame = function () {
        var requestAnimFrame = window.requestAnimationFrame;

        var lastTime = Date.now();

        if (Utils.prototype.isMobile() || !requestAnimFrame) {
            requestAnimFrame = function (callback) {
                var deltaTime = Date.now() - lastTime;
                var delay = Math.max(0, 1000 / 60 - deltaTime);

                return window.setTimeout(function () {
                    lastTime = Date.now();
                    callback();
                }, delay);
            };
        }
        return requestAnimFrame;
    };

    $(function () {
        GApp.Utils = new Utils();
    });


})(jQuery);
