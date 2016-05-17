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

    var GApp = window.GApp || {};

    $.transit = {
        propertyMap: {
            marginLeft: 'margin',
            marginRight: 'margin',
            marginBottom: 'margin',
            marginTop: 'margin',
            paddingLeft: 'padding',
            paddingRight: 'padding',
            paddingBottom: 'padding',
            paddingTop: 'padding'
        },
        enabled: true,
        useTransitionEnd: false
    };

    var div = document.createElement('div');
    var support = {};

    // Helper function to get the proper vendor property name.
    function getVendorPropertyName(prop) {
        if (prop in div.style) return prop;

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        for (var i = 0; i < prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) {
                return vendorProp;
            }
        }
    }

    // Helper function to check if transform3D is supported.
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    // Check for the browser's transitions support.
    support.transition = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transform = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.filter = getVendorPropertyName('Filter');
    support.transform3d = checkTransform3dSupport();

    var eventNames = {
        'transition': 'transitionend',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition': 'MSTransitionEnd'
    };

    // Detect the 'transitionend' event needed.
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // Populate jQuery's `$.support` with the vendor prefixes we know.
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
            $.support[key] = support[key];
        }
    }

    // Avoid memory leak in IE.
    div = null;

    // ## $.cssEase
    $.cssEase = {
        '_default': 'ease',
        'in': 'ease-in',
        'out': 'ease-out',
        'in-out': 'ease-in-out',
        'snap': 'cubic-bezier(0,1,.5,1)',
        // Penner equations
        'easeInCubic': 'cubic-bezier(.550,.055,.675,.190)',
        'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
        'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
    };

    // ## 'transform' CSS hook
    // Allows you to use the `transform` property in CSS.
    $.cssHooks['transit:transform'] = {
        // The getter returns a `Transform` object.
        get: function (elem) {
            return $(elem).data('transform') || new Transform();
        },

        // The setter accepts a `Transform` object or a string.
        set: function (elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

    // Add a CSS hook for `.css({ transform: '...' })`.
    $.cssHooks.transform = {
        set: $.cssHooks['transit:transform'].set
    };

    // ## 'filter' CSS hook
    $.cssHooks.filter = {
        get: function (elem) {
            return elem.style[support.filter];
        },
        set: function (elem, value) {
            elem.style[support.filter] = value;
        }
    };

    // ## 'transformOrigin' CSS hook
    $.cssHooks.transformOrigin = {
        get: function (elem) {
            return elem.style[support.transformOrigin];
        },
        set: function (elem, value) {
            elem.style[support.transformOrigin] = value;
        }
    };

    // ## 'transition' CSS hook
    $.cssHooks.transition = {
        get: function (elem) {
            return elem.style[support.transition];
        },
        set: function (elem, value) {
            elem.style[support.transition] = value;
        }
    };


    // ## Other CSS hooks
    registerCssHook('scale');
    registerCssHook('scaleX');
    registerCssHook('scaleY');
    registerCssHook('translate');
    registerCssHook('rotate');
    registerCssHook('rotateX');
    registerCssHook('rotateY');
    registerCssHook('rotate3d');
    registerCssHook('perspective');
    registerCssHook('skewX');
    registerCssHook('skewY');
    registerCssHook('x', true);
    registerCssHook('y', true);

    // ## Transform class
    var Transform = function (str) {
        if (typeof str === 'string') {
            this.parse(str);
        }
        return this;
    }

    Transform.prototype.setFromString = function (prop, val) {
        var args =
            (typeof val === 'string') ? val.split(',') :
                (val.constructor === Array) ? val :
                    [val];

        args.unshift(prop);

        Transform.prototype.set.apply(this, args);
    }

    // ### set()
    // Sets a property.
    Transform.prototype.set = function (prop) {
        var args = Array.prototype.slice.apply(arguments, [1]);
        if (this.setter[prop]) {
            this.setter[prop].apply(this, args);
        } else {
            this[prop] = args.join(',');
        }
    }

    Transform.prototype.get = function (prop) {
        if (this.getter[prop]) {
            return this.getter[prop].apply(this);
        } else {
            return this[prop] || 0;
        }
    }

    Transform.prototype.setter = {
        // ### rotate
        rotate: function (theta) {
            this.rotate = unit(theta, 'deg');
        },

        rotateX: function (theta) {
            this.rotateX = unit(theta, 'deg');
        },

        rotateY: function (theta) {
            this.rotateY = unit(theta, 'deg');
        },

        // ### scale
        scale: function (x, y) {
            if (y === undefined) {
                y = x;
            }
            this.scale = x + "," + y;
        },

        // ### skewX + skewY
        skewX: function (x) {
            this.skewX = unit(x, 'deg');
        },

        skewY: function (y) {
            this.skewY = unit(y, 'deg');
        },

        // ### perspectvie
        perspective: function (dist) {
            this.perspective = unit(dist, 'px');
        },

        // ### x / y
        // Translations. Notice how this keeps the other value.
        x: function (x) {
            this.set('translate', x, null);
        },

        y: function (y) {
            this.set('translate', null, y);
        },

        // ### translate
        translate: function (x, y) {
            if (this._translateX === undefined) {
                this._translateX = 0;
            }
            if (this._translateY === undefined) {
                this._translateY = 0;
            }

            if (x !== null && x !== undefined) {
                this._translateX = unit(x, 'px');
            }
            if (y !== null && y !== undefined) {
                this._translateY = unit(y, 'px');
            }

            this.translate = this._translateX + "," + this._translateY;
        }
    }

    Transform.prototype.getter = {
        x: function () {
            return this._translateX || 0;
        },

        y: function () {
            return this._translateY || 0;
        },

        scale: function () {
            var s = (this.scale || "1,1").split(',');
            if (s[0]) {
                s[0] = parseFloat(s[0]);
            }
            if (s[1]) {
                s[1] = parseFloat(s[1]);
            }

            // "2.5,2.5" => 2.5
            return (s[0] === s[1]) ? s[0] : s;
        },

        rotate3d: function () {
            var s = (this.rotate3d || "0,0,0,0deg").split(',');
            for (var i = 0; i <= 3; ++i) {
                if (s[i]) {
                    s[i] = parseFloat(s[i]);
                }
            }
            if (s[3]) {
                s[3] = unit(s[3], 'deg');
            }

            return s;
        }
    }

    // ### parse()
    // Parses from a string. Called on constructor.
    Transform.prototype.parse = function (str) {
        var self = this;
        str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function (x, prop, val) {
            self.setFromString(prop, val);
        });
    }

    // ### toString()
    Transform.prototype.toString = function (use3d) {
        var re = [];

        for (var i in this) {
            if (this.hasOwnProperty(i)) {
                // Don't use 3D transformations if the browser can't support it.
                if ((!support.transform3d) && (
                    (i === 'rotateX') ||
                    (i === 'rotateY') ||
                    (i === 'perspective') ||
                    (i === 'transformOrigin'))) {
                    continue;
                }

                if (i[0] !== '_') {
                    if (use3d && (i === 'scale')) {
                        re.push(i + "3d(" + this[i] + ",1)");
                    } else if (use3d && (i === 'translate')) {
                        re.push(i + "3d(" + this[i] + ",0)");
                    } else {
                        re.push(i + "(" + this[i] + ")");
                    }
                }
            }
        }

        return re.join(" ");
    }


    function callOrQueue(self, queue, fn) {
        if (queue === true) {
            self.queue(fn);
        } else if (queue) {
            self.queue(queue, fn);
        } else {
            self.each(function () {
                fn.call(this);
            });
        }
    }

    // ### getProperties(dict)
    function getProperties(props) {
        var re = [];

        $.each(props, function (key) {
            key = $.camelCase(key); // Convert "text-align" => "textAlign"
            key = $.transit.propertyMap[key] || $.cssProps[key] || key;
            key = uncamel(key); // Convert back to dasherized

            // Get vendor specify propertie
            if (support[key])
                key = uncamel(support[key]);

            if ($.inArray(key, re) === -1) {
                re.push(key);
            }
        });

        return re;
    }

    /**
     * トランジションを取得
     * @param properties
     * @param duration
     * @param easing
     * @param delay
     * @returns {string}
     */
    function getTransition(properties, duration, easing, delay) {
        // プロパティを取得
        var props = getProperties(properties);

        // Account for aliases (`in` => `ease-in`).
        if ($.cssEase[easing]) {
            easing = $.cssEase[easing];
        }

        // Build the duration/easing/delay attributes for it.
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) {
            attribs += ' ' + toMS(delay);
        }

        var transitions = [];
        $.each(props, function (i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }

    /**
     * jQuery プラグインとして登録
     * @param properties
     * @param duration
     * @param easing
     * @param callback
     * @returns {jQuery}
     */
    $.fn.transition = function (properties, duration, easing, callback) {
        var self = this;
        var delay = 0;
        var queue = true;

        var theseProperties = $.extend(true, {}, properties);

        if (typeof duration === 'function') {
            callback = duration;
            duration = undefined;
        }

        if (typeof duration === 'object') {
            easing = duration.easing;
            delay = duration.delay || 0;
            queue = typeof duration.queue === "undefined" ? true : duration.queue;
            callback = duration.complete;
            duration = duration.duration;
        }

        if (typeof easing === 'function') {
            callback = easing;
            easing = undefined;
        }

        // Alternate syntax.
        if (typeof theseProperties.easing !== 'undefined') {
            easing = theseProperties.easing;
            delete theseProperties.easing;
        }

        if (typeof theseProperties.duration !== 'undefined') {
            duration = theseProperties.duration;
            delete theseProperties.duration;
        }

        if (typeof theseProperties.complete !== 'undefined') {
            callback = theseProperties.complete;
            delete theseProperties.complete;
        }

        if (typeof theseProperties.queue !== 'undefined') {
            queue = theseProperties.queue;
            delete theseProperties.queue;
        }

        if (typeof theseProperties.delay !== 'undefined') {
            delay = theseProperties.delay;
            delete theseProperties.delay;
        }

        // Set defaults. (`400` duration, `ease` easing)
        if (typeof duration === 'undefined') {
            duration = $.fx.speeds._default;
        }
        if (typeof easing === 'undefined') {
            easing = $.cssEase._default;
        }

        duration = toMS(duration);

        // Build the `transition` property.
        var transitionValue = getTransition(theseProperties, duration, easing, delay);

        // Compute delay until callback.
        var work = $.transit.enabled && support.transition;
        var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

        // If there's nothing to do...
        if (i === 0) {
            var fn = function (next) {
                self.css(theseProperties);
                if (callback) {
                    callback.apply(self);
                }
                if (next) {
                    next();
                }
            };

            callOrQueue(self, queue, fn);
            return self;
        }

        // Save the old transitions of each element so we can restore it later.
        var oldTransitions = {};

        var run = function (nextCall) {
            var bound = false;

            // Prepare the callback.
            var cb = function () {
                if (bound) {
                    self.unbind(transitionEnd, cb);
                }

                if (i > 0) {
                    self.each(function () {
                        this.style[support.transition] = (oldTransitions[this] || null);
                    });
                }

                if (typeof callback === 'function') {
                    callback.apply(self);
                }
                if (typeof nextCall === 'function') {
                    nextCall();
                }
            };

            if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
                // Use the 'transitionend' event if it's available.
                bound = true;
                self.bind(transitionEnd, cb);
            } else {
                // Fallback to timers if the 'transitionend' event isn't supported.
                window.setTimeout(cb, i);
            }

            // Apply transitions.
            self.each(function () {
                if (i > 0) {
                    this.style[support.transition] = transitionValue;
                }
                $(this).css(theseProperties);
            });
        };

        // Defer running. This allows the browser to paint any pending CSS it hasn't
        var deferredRun = function (next) {
            this.offsetWidth = this.offsetWidth; // force a repaint
            run(next);
        };

        // Use jQuery's fx queue.
        callOrQueue(self, queue, deferredRun);

        // Chainability.
        return this;
    };

    /**
     * jQuery で取り扱えるようにCSSプロパティを登録
     * @param prop
     * @param isPixels
     */
    function registerCssHook(prop, isPixels) {
        if (!isPixels) {
            $.cssNumber[prop] = true;
        }

        $.transit.propertyMap[prop] = support.transform;

        $.cssHooks[prop] = {
            get: function (elem) {
                var t = $(elem).css('transit:transform');
                return t.get(prop);
            },

            set: function (elem, value) {
                var t = $(elem).css('transit:transform');
                t.setFromString(prop, value);

                $(elem).css({'transit:transform': t});
            }
        };

    }

    /**
     * キャメルケースをCSS
     * @param str
     * @returns {*}
     */
    function uncamel(str) {
        return str.replace(/([A-Z])/g, function (letter) {
            return '-' + letter.toLowerCase();
        });
    }

    function unit(i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    function toMS(duration) {
        var i = duration;

        if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) {
            i = $.fx.speeds[i] || $.fx.speeds._default;
        }

        return unit(i, 'ms');
    }

    $.transit.getTransitionValue = getTransition;

})
(jQuery);
